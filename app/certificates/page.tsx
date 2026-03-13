import DashboardLayout from "@/components/layout/DashboardLayout";
import ExpiringCertificates from "@/components/shops/ExpiringCertificates";
import CertificateVerifier from "@/components/shops/CertificateVerifier";

export default function CertificatesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ExpiringCertificates />
        <CertificateVerifier />
      </div>
    </DashboardLayout>
  );
}
