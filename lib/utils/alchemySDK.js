// Client-side compatible Alchemy API calls
export async function getLastTransactionTimestampForAddress(
  fromAddress,
  network
) {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

  let RPC = "";
  if (network === "sepolia") {
    RPC = `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;
  } else {
    RPC = `https://base-sepolia.g.alchemy.com/v2/${alchemyKey}`;
  }

  try {
    const res = await fetch(RPC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
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
    });

    const data = await res.json();

    if (data.result?.transfers?.length > 0) {
      const date = new Date(data.result.transfers[0].metadata.blockTimestamp);
      const timestamp = date.getTime() / 1000;
      return timestamp;
    }

    return 0;
  } catch (error) {
    console.error("Error in getLastTransactionTimestampForAddress:", error);
    return 0;
  }
}
