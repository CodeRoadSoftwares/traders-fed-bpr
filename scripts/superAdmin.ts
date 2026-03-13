import { User } from "@/lib/db/models";
import { hash } from "bcrypt";
import { connect } from "mongoose";
import "dotenv/config";
export default async function createSuperAdmin() {
  const dbUrl = process.env.MONGODB_URI as string;
  await connect(dbUrl);
  const superAdminExists = await User.findOne({ role: "SUPER_ADMIN" });
  if (superAdminExists) {
    console.log("skipping admin script");
    return;
  } else {
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL!;
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD!;
    const SUPER_ADMIN_PHONE = process.env
      .SUPER_ADMIN_PHONE as unknown as number;
    const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME!;

    const hashedPassword = await hash(SUPER_ADMIN_PASSWORD, 10);
    const superAdmin = await User.create({
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      phone: SUPER_ADMIN_PHONE,
      role: "SUPER_ADMIN",
    });
    if (superAdmin) {
      console.log("super admin created");
    }
    return;
  }
}
createSuperAdmin();
