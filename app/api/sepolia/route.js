import { sepoliaClient } from "@/lib/client"

export async function GET() {
  try {
    console.log("sepoliaClient", sepoliaClient)
    let blockNumber = await sepoliaClient.getBlockNumber()
    let gasPrice = await sepoliaClient.getGasPrice()
    blockNumber = blockNumber.toString()
    gasPrice = gasPrice.toString()
    gasPrice = gasPrice / 1e9
    gasPrice = gasPrice.toFixed(2)
    gasPrice = `${gasPrice} Gwei`
    console.log("blockNumber", blockNumber)
    console.log("gasPrice", gasPrice)
    return Response.json({ blockNumber, gasPrice })
  } catch (err) {
    console.log("error", err)
    return Response.error({ error: err })
  }
}
