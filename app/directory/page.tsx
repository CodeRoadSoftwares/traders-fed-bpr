import Navbar from "@/components/layout/Navbar";
import ShopDirectory from "@/components/directory/ShopDirectory";

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ShopDirectory />
    </div>
  );
}
