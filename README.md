# Money Converter

A simple and functional currency converter that allows users to convert values between different currencies using automatically updated exchange rates. The project features a Node.js backend with Express to handle API requests for exchange rates and a lightweight frontend built with HTML, CSS, and JavaScript, with the potential for integration with Vue 3 + Vite.

## Features

- **Currency Conversion**: Convert values between currencies (e.g., USD to BRL, EUR, etc.) with up-to-date exchange rates.
- **Automatic Updates**: Exchange rates are updated every 12 hours via an external API (`exchangerate-api.com`).
- **Simple Interface**: Dropdowns for selecting currencies, an input field for the amount, and real-time conversion results.
- **Local Cache**: Rates are stored in `taxas.json` to reduce API calls.
- **Robust Backend**: REST API with endpoints `/api/symbols` (list of currencies) and `/api/convert` (conversion).

## Technologies Used

- **Frontend**:
  - HTML5, CSS3, JavaScript (ES Modules)
  - Structure ready for integration with Vue 3 + Vite
- **Backend**:
  - Node.js with Express.js
  - Axios for external API requests
  - CORS to allow frontend requests
- **External API**: [ExchangeRate-API](https://www.exchangerate-api.com)
- **Other Tools**:
  - Git for version control
  - Vite (optional, for frontend development with Vue)
 
  - //
 
- 
## Prerequisites

- **Node.js** (version 16 or higher)
- **Git** (to clone the repository)
- Account with [ExchangeRate-API](https://www.exchangerate-api.com) for an API key (optional, to avoid rate limits)

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yCalter/moneyconverter.git
   cd convert
   
