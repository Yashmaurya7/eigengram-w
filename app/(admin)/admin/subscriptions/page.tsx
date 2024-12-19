import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { allowedMails } from "@/lib/constants";
import { SubscriptionList } from "@/components/subscription-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function AdminSubscriptions() {
  const session= await getServerSession(authOptions)
  const user =  session?.user;

  if (!user || !allowedMails.includes(user.email!)) {
    redirect("/dashboard");
  }

  const subscriptions = await db.subscription.findMany({
    include: {
      user: true,
      service: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          awsModelUrl: true,
          price: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const serializableSubscriptions = subscriptions.map(sub => ({
    ...sub,
    service: {
      ...sub.service,
      price: sub.service.price.toString(),
    }
  }))

  return (
    <div className="container mx-auto">
      <div className="flex gap-2">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold mb-6">Subscription Requests</h1>
      </div>
      <SubscriptionList subscriptions={serializableSubscriptions} />
    </div>
  );
}
