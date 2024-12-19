"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function requestSubscription({
  userId,
  serviceId,
}: {
  userId: string;
  serviceId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await db.subscription.create({
      data: {
        userId,
        serviceId,
        status: "PENDING",
        startDate: new Date(),
      },
    });

    revalidatePath(`/services/${serviceId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error requesting subscription:", error);
    return { success: false, error: "Failed to submit subscription request" };
  }
}

export async function updateSubscriptionStatus({
  subscriptionId,
  status,
}: {
  subscriptionId: string;
  status: "ACTIVE" | "INACTIVE" | "CANCELLED";
}): Promise<{ success: boolean; error?: string }> {
  try {
    await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        status,
        startDate: status === "ACTIVE" ? new Date() : undefined,
      },
    });

    revalidatePath("/admin/subscriptions");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return { success: false, error: "Failed to update subscription" };
  }
}
