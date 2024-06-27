import { networks } from "@/constants";
import NetworkCard from "@/components/ui/NetworkCard";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      {networks.map((network) => {
        return <NetworkCard key={network} name={network} />;
      })}
    </main>
  );
}
