import FaucetInfo from "@/components/ui/FaucetInfo";
import NetworkInfo from "@/components/ui/NetworkInfo";
import { networks } from "@/constants";

// Generate static paths for all networks
export function generateStaticParams() {
  return networks.map((network) => ({
    network: network,
  }));
}

export default async function Page({ params }) {
  const { network } = await params;
  return (
    <div className="flex flex-col items-center ">
      <NetworkInfo network={network} />
      <FaucetInfo network={network} />
    </div>
  );
}
