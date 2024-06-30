# Base Faucet Aggregator 🌉💧

![Next.js](https://img.shields.io/badge/Next.js-14.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Web3](https://img.shields.io/badge/Web3-Blockchain-green)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black)

A website to display all the available faucets for obtaining Base Testnet Tokens across Ethereum Sepolia and Base Sepolia.

## 🚀 Demo

Check out the live demo: [Base Faucet](https://base.faucet.dev/)

## 📚 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- Display all faucets for Base Testnet Tokens.
- Easy navigation and user-friendly interface.
- Integration with multiple networks.
- Optimized for performance and accessibility.

## 🛠️ Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/HAPPYS1NGH/Base-Faucet.git
cd Base-Faucet
npm install
```

## 🚀 Usage

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧩 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feat/feature-name-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'feat: add some feature'`).
5. Push to the branch (`git push origin feat/feature-name-branch`).
6. Open a pull request.

## ➕ Adding Faucets

To add a new faucet, modify the constants/index.js file with the following format:

```javascript
{
  name: "FaucetName",
  link: "faucetlink",
  maxAmount: "0.05", // Copy same if not applicable
  minAmount: "0.05", // Copy same if not applicable
  recover: "24 Hours",
  dailySupply: "None",
  required: "Requirement Needed",
  image: "faucets/{faucetname.svg}}",
  address: "0x12..", // Wallet which drips the tokens
},
```

## 📜 License

This project is licensed under the MIT License.
