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

    const latest = data.result?.transfers?.[0];
    if (latest) {
      const blockTimestamp = latest.metadata?.blockTimestamp;
      if (blockTimestamp) {
        return new Date(blockTimestamp).getTime() / 1000;
      }

      // Alchemy intermittently returns metadata: null for very recent
      // transfers (the block is indexed before metadata enrichment
      // completes). Without this fallback the newest activity is lost
      // and the faucet shows "active Unknown". Derive the time from the
      // block itself instead.
      if (latest.blockNum) {
        const blockRes = await fetch(RPC, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBlockByNumber",
            params: [latest.blockNum, false],
          }),
        });
        const blockData = await blockRes.json();
        if (blockData.result?.timestamp) {
          return parseInt(blockData.result.timestamp, 16);
        }
      }
    }

    return 0;
  } catch (error) {
    console.error("Error in getLastTransactionTimestampForAddress:", error);
    return 0;
  }
}
