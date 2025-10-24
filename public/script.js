async function getSymbols() {
  try {
    const res = await fetch("/api/symbols");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.symbols) {
      throw new Error("Invalid API response: symbols data missing");
    }
    return data;
  } catch (error) {
    console.error("Error fetching symbols:", error.message);
    throw error;
  }
}

async function convert(from, to, amount) {
  try {
    const params = new URLSearchParams({ from, to, amount });
    const res = await fetch(`/api/convert?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error converting currency:", error.message);
    throw error;
  }
}

async function main() {
  const resultDiv = document.getElementById("result");
  const fromSel = document.getElementById("from");
  const toSel = document.getElementById("to");
  const btn = document.getElementById("convertBtn");

  resultDiv.textContent = "Carregando moedas...";

  try {
    const { symbols } = await getSymbols();
    const keys = Object.keys(symbols).sort();

    // Clear existing options (if any)
    fromSel.innerHTML = "";
    toSel.innerHTML = "";

    // Populate dropdowns
    keys.forEach((code) => {
      const opt1 = document.createElement("option");
      const opt2 = document.createElement("option");
      opt1.value = opt2.value = code;
      opt1.textContent = opt2.textContent = code;
      fromSel.appendChild(opt1);
      toSel.appendChild(opt2);
    });

    // Set default values
    fromSel.value = "USD";
    toSel.value = "BRL";
    resultDiv.textContent = "Pronto para converter.";
  } catch (error) {
    resultDiv.textContent = "Erro ao carregar moedas: " + error.message;
    return;
  }

  btn.addEventListener("click", async () => {
    const amount = document.getElementById("amount").value;
    const from = fromSel.value;
    const to = toSel.value;

    if (!amount || !from || !to) {
      resultDiv.textContent = "Por favor, preencha todos os campos.";
      return;
    }

    resultDiv.textContent = "Convertendo...";

    try {
      const data = await convert(from, to, amount);
      if (!data.success) {
        resultDiv.textContent = "Erro: " + data.error;
        return;
      }

      resultDiv.innerHTML = `
        <strong>${data.query.amount} ${data.query.from}</strong> = 
        <strong>${data.result.toFixed(4)} ${data.query.to}</strong><br>
        Taxa: ${data.rate.toFixed(6)}
      `;
    } catch (error) {
      resultDiv.textContent = "Erro na conversão: " + error.message;
    }
  });
}

window.addEventListener("DOMContentLoaded", main);