import express from "express";
import axios from "axios";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const TAXAS_FILE = path.join(__dirname, "taxas.json");
let rates = {};
let base = "USD";

async function atualizarTaxas() {
  try {
    const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`);
    rates = res.data.rates;
    base = res.data.base;

    fs.writeFileSync(
      TAXAS_FILE,
      JSON.stringify({ base, date: res.data.date, rates }, null, 2)
    );
    console.log("Taxas atualizadas:", res.data.date);
  } catch (err) {
    console.error("Erro ao atualizar taxas:", err.message);
  }
}

// Load cached rates or fetch new ones
if (fs.existsSync(TAXAS_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(TAXAS_FILE));
    rates = data.rates || {};
    base = data.base || "USD";
    console.log("Taxas carregadas do cache:", data.date);
  } catch (err) {
    console.error("Erro ao carregar taxas do cache:", err.message);
    atualizarTaxas();
  }
} else {
  atualizarTaxas();
}

// Update rates every 12 hours
setInterval(atualizarTaxas, 12 * 60 * 60 * 1000);

app.get("/api/symbols", (req, res) => {
  if (Object.keys(rates).length === 0) {
    return res.status(500).json({ success: false, error: "Nenhuma taxa de câmbio disponível" });
  }
  const symbols = Object.keys(rates).reduce((acc, key) => {
    acc[key] = { description: key };
    return acc;
  }, {});
  res.json({ success: true, symbols });
});

app.get("/api/convert", (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) {
    return res.status(400).json({ success: false, error: "Parâmetros ausentes" });
  }
  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: "Valor inválido" });
  }
  if (!rates[from] || !rates[to]) {
    return res.status(400).json({ success: false, error: "Moeda inválida" });
  }

  const valorUSD = Number(amount) / rates[from];
  const convertido = valorUSD * rates[to];

  res.json({
    success: true,
    base,
    date: new Date().toISOString().split("T")[0],
    query: { from, to, amount: Number(amount) },
    rate: rates[to] / rates[from],
    result: convertido,
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});