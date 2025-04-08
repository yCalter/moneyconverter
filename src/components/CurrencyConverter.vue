<template>
  <div class="currency-converter">
    <h2>Currency Converter</h2>

    <input
      type="number"
      v-model.number="amount"
      placeholder="Type Value"
      min="0"
    />

    <select v-model="fromCurrency">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>

    <span>→</span>

    <select v-model="toCurrency">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>

    <button @click="convert" :disabled="loading">
      {{ loading ? "Converting..." : "Convert" }}
    </button>

    <p v-if="conversionResult !== null">
      {{ amount }} {{ fromCurrency }} = {{ conversionResult }} {{ toCurrency }}
    </p>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
  <footer class="whtmark">© 2025 - Developed by Calter</footer>
</template>

<script>
export default {
  data() {
    return {
      amount: 1,
      fromCurrency: "USD",
      toCurrency: "BRL",
      currencies: ["USD", "BRL", "EUR", "JPY", "GBP"],
      conversionResult: null,
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async convert() {
      this.loading = true;
      this.errorMessage = "";
      this.conversionResult = null;

      const apiKey = "10326cb09b4e10f0699fd938";

      try {
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${this.fromCurrency}/${this.toCurrency}/${this.amount}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.result === "success") {
          this.conversionResult = data.conversion_result;
        } else {
          this.errorMessage = "Error converting. Check currencies or API limit";
        }
      } catch (err) {
        this.errorMessage = "Connection error. Verify your connection";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.currency-converter {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

input,
select,
button {
  margin: 8px 4px;
  padding: 6px;
  font-size: 16px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
