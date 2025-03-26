import FaucetInfo from "@/components/ui/FaucetInfo";
import NetworkInfo from "@/components/ui/NetworkInfo";

export default function Page({ params }) {
  return (
    <div className="flex flex-col items-center ">
      <NetworkInfo network={params.network} />
      <FaucetInfo network={params.network} />
    </div>
  );
}
