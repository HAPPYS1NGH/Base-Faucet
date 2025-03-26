import { baseSepoliaClient } from "@/lib/client";

export async function GET() {
  let blockNumber = await baseSepoliaClient.getBlockNumber();
  let gasPrice = await baseSepoliaClient.getGasPrice();
  blockNumber = blockNumber.toString();
  gasPrice = gasPrice.toString();
  //  Convert gas price into wei, gwei whichever is correct for 2 decimal place use K for 1000 and million M
  let gasPriceUnit;
  if (parseFloat(gasPrice) > 1e9) {
    gasPriceUnit = "Gwei"; // Keep in Gwei if above 1 billion
    gasPrice = parseFloat(gasPrice).toFixed(2); // Ensure two decimal places
  } else if (parseFloat(gasPrice) >= 1e6) {
    gasPriceUnit = "K Wei"; // Convert to kilo-Gwei (k) if between 1 million and 1 billion
    gasPrice = (parseFloat(gasPrice) / 1e6).toFixed(2); // Divide by 1e6 and ensure two decimal places
  } else {
    gasPriceUnit = "M Wei"; // Convert to mega-Gwei (M) if below 1 million
    gasPrice = (parseFloat(gasPrice) / 1e6).toFixed(2); // Divide by 1e6 and ensure two decimal places
  }
  let gasValue = `${gasPrice}${gasPriceUnit}`;
  return Response.json({ blockNumber, gasPrice: gasValue });
}
