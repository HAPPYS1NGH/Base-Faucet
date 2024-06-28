import { createPublicClient, http, fallback } from "viem";
import { baseSepolia, sepolia } from "viem/chains";
// import { Alchemy, Network } from "alchemy-sdk";

const sepoliaRpc = process.env.SEPOLIA_RPC;
const baseSepoliaRPC = process.env.BASE_SEPOLIA_RPC;

export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: fallback([
    http(sepoliaRpc, {
      batch: true,
    }),
    http("https://eth-sepolia.public.blastapi.io"),
  ]),
});

export const baseSepoliaClient = createPublicClient({
  chain: baseSepolia,
  transport: http(baseSepoliaRPC, {
    batch: true,
  }),
});

// const sepoliaConfig = {
//   apiKey: process.env.ALCHEMY_KEY,
//   network: Network.ETH_SEPOLIA,
// };

// export const sepoliaAlchemy = new Alchemy(sepoliaConfig);
