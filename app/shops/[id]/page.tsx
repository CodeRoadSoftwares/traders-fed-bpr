import DashboardLayout from "@/components/layout/DashboardLayout";
import ShopDetails from "@/components/shops/ShopDetails";

export default function ShopDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <DashboardLayout>
      <ShopDetails params={params} />
    </DashboardLayout>
  );
}
