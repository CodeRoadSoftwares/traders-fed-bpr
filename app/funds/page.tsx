import Navbar from "@/components/layout/Navbar";
import FundsDashboard from "@/components/funds/FundsDashboard";

export default function FundsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Navbar />
      <FundsDashboard />
    </div>
  );
}
