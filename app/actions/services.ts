"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createService(formData: FormData): Promise<void> {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const awsModelUrl = formData.get("awsModelUrl") as string;
    const price = parseFloat(formData.get("price") as string);
    const imageUrl = (formData.get("imageUrl") as string) || undefined;

    await db.service.create({
      data: {
        name,
        description,
        awsModelUrl,
        price,
        imageUrl,
      },
    });

    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Error creating service:", error);
    // Instead of returning an error object, we'll throw an error
    throw new Error("Failed to create service");
  }
}
