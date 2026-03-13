import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminsList from "@/components/admins/AdminsList";

export default function AdminsPage() {
  return (
    <DashboardLayout>
      <AdminsList />
    </DashboardLayout>
  );
}
