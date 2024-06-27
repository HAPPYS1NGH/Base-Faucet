import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import "./globals.css";

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

const montserrat = Montserrat({ subsets: ["latin"] });
const coinbase = localFont({
  src: [
    {
      path: "fonts/Coinbase_Display-Bold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata = {
  title: "Base Faucet App",
  description:
    "Find Base faucets to get testnet tokens for your next project. Explore Base Testnet faucets.",
  keywords: [
    "base-faucet",
    "testnet tokens base",
    "base",
    "base faucet",
    "faucet",
    "based faucet",
    "Sepolia faucet",
    "Goerli faucet",
    "testnet tokens",
    "crypto testnet",
    "blockchain development",
    "blockchain testnet",
    "Ethereum testnet",
    "Ethereum faucet",
    "base testnet",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}  text-center`}>
        <nav className={`${coinbase.className}`}>
          <Header />
        </nav>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
