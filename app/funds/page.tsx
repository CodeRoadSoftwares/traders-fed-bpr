import Navbar from "@/components/layout/Navbar";
import FundsDashboard from "@/components/funds/FundsDashboard";

export default function FundsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <FundsDashboard />
    </div>
  );
}
