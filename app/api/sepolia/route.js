import { sepoliaClient } from "@/lib/client";

export async function GET() {
  try {
    let blockNumber = await sepoliaClient.getBlockNumber();
    let gasPrice = await sepoliaClient.getGasPrice();
    blockNumber = blockNumber.toString();
    gasPrice = gasPrice.toString();
    gasPrice = gasPrice / 1e9;
    gasPrice = gasPrice.toFixed(2);
    gasPrice = `${gasPrice} Gwei`;
    return Response.json({ blockNumber, gasPrice });
  } catch (err) {
    console.error("error", err);
    return Response.error({ error: err });
  }
}
