export async function getLastTransactionTimestampForAddress(
  fromAddress,
  network
) {
  let RPC = "";
  if (network === "sepolia") {
    RPC = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
  } else {
    RPC = `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
  }
  try {
    const res = await fetch(RPC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            fromAddress: fromAddress,
            category: ["external"],
            order: "desc",
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: "0x1",
          },
        ],
      }),
      next: {
        revalidate: 600,
      },
    });
    const data = await res.json();
    const date = new Date(data.result.transfers[0].metadata.blockTimestamp);
    const timestamp = date.getTime() / 1000;
    return timestamp;
  } catch (error) {
    console.error("Error in GET request:", error);
  }
}
