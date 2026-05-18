import { createPublicClient, http, fallback } from "viem";
import { baseSepolia, sepolia } from "viem/chains";

// Use NEXT_PUBLIC_ prefix for client-side access
const sepoliaRpc = process.env.NEXT_PUBLIC_SEPOLIA_RPC;
const baseSepoliaRPC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC;

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
  transport: fallback([
    http(baseSepoliaRPC, {
      batch: true,
    }),
    http("https://base-sepolia.public.blastapi.io"),
  ]),
});

// Export chain configurations for client-side usage
export const chainConfigs = {
  Sepolia: {
    client: sepoliaClient,
    chain: sepolia,
  },
  BaseSepolia: {
    client: baseSepoliaClient,
    chain: baseSepolia,
  },
};
