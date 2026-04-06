import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Shop } from "@/lib/db/models";
import { shopSchema } from "@/validation/shop/shop.validation";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const data = await req.json();
    const { id, ...updateData } = data;

    console.log("Update request data:", JSON.stringify(updateData, null, 2));

    const shop = await Shop.findById(new Types.ObjectId(id));
    if (!shop) {
      return NextResponse.json({ message: "shop not found" }, { status: 404 });
    }
    if (shop.userId.toString() !== user.id && user.role === "SHOP") {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }

    // Handle nested documents object with dot notation
    if (updateData.documents) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateObj: Record<string, any> = {};

      if (updateData.documents.aadhar !== undefined) {
        updateObj["documents.aadhar"] = updateData.documents.aadhar;
      }
      if (updateData.documents.pan !== undefined) {
        updateObj["documents.pan"] = updateData.documents.pan;
      }
      if (updateData.documents.photograph !== undefined) {
        updateObj["documents.photograph"] = updateData.documents.photograph;
      }
      if (updateData.documents.municipalityCertificate !== undefined) {
        updateObj["documents.municipalityCertificate"] =
          updateData.documents.municipalityCertificate;
      }
      if (updateData.documents.rentOrElectricityBill !== undefined) {
        updateObj["documents.rentOrElectricityBill"] =
          updateData.documents.rentOrElectricityBill;
      }
      if (updateData.documents.otherLicenses !== undefined) {
        updateObj["documents.otherLicenses"] =
          updateData.documents.otherLicenses;
      }

      // Add shopkeeperPhoto if provided
      if (updateData.shopkeeperPhoto !== undefined) {
        updateObj["shopkeeperPhoto"] = updateData.shopkeeperPhoto;
      }

      console.log(
        "Update object with dot notation:",
        JSON.stringify(updateObj, null, 2),
      );

      const updated = await Shop.findByIdAndUpdate(
        new Types.ObjectId(id),
        { $set: updateObj },
        { new: true, runValidators: false },
      );

      console.log(
        "Updated shop documents:",
        JSON.stringify(updated?.documents, null, 2),
      );

      return NextResponse.json(
        { message: "shop updated successfully", data: updated },
        { status: 200 },
      );
    }

    // Validate only if full shop data is provided
    let dataToUpdate = updateData;
    if (
      updateData.shopName &&
      updateData.registrationNumber &&
      updateData.licenseNumber
    ) {
      dataToUpdate = shopSchema.parse(updateData);
    }

    console.log("Data to update:", JSON.stringify(dataToUpdate, null, 2));

    const updated = await Shop.findByIdAndUpdate(
      new Types.ObjectId(id),
      dataToUpdate,
      { new: true },
    );

    console.log(
      "Updated shop documents:",
      JSON.stringify(updated?.documents, null, 2),
    );

    return NextResponse.json(
      { message: "shop updated successfully", data: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
