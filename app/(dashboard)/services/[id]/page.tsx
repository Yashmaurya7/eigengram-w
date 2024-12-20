import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RequestSubscriptionForm } from "@/components/request-subscription-form";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export async function generateStaticParams() {
  const services = await db.service.findMany({ select: { id: true } });
  return services.map((service) => ({ id: service.id }));
}

export default async function ServicePage({
  params,
}: {
    params: Promise<{ id: string }>;
}) {
 const resolvedParams = await params;
 const session=await getServerSession(authOptions)
 const user=session?.user

  if (!user) {
    redirect("/api/auth/login");
  }

  const dbUser = await db.user.findUnique({
    where: { username: user.username },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  const service = await db.service.findUnique({
    where: { id: resolvedParams.id },
    include: {
      subscriptions: {
        where: { userId: dbUser.id },
      },
    },
  });

  if (!service) {
    notFound();
  }

  const existingSubscription = service.subscriptions[0];

  return (
    <div className="container mx-auto py-10 min-h-screen">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Card>
        <CardHeader className="w-full flex flex-row justify-between">
          <div className="">
            <CardTitle className="text-xl">{service.name}</CardTitle>
            <CardDescription>${service.price.toFixed(2)}</CardDescription>
          </div>
          <div className="">
            {existingSubscription ? (
              <p className="text-sm text-muted-foreground">
                Subscription status: {existingSubscription.status}
              </p>
            ) : (
              <RequestSubscriptionForm
                userId={dbUser.id}
                serviceId={service.id}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {service.imageUrl && (
            <div className="relative h-64 w-full">
              <Image
                src={service.imageUrl}
                alt={service.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
          <div className="flex gap-4 w-full">
            <div className="w-full">
              <h3 className="font-semibold">Description:</h3>
              <p className="text-sm text-muted-foreground break-all">
                {service.description}
              </p>
            </div>
            <div className="w-2/5">
              <h3 className="font-semibold">AWS Model URL:</h3>
              <p className="text-sm text-muted-foreground break-all">
                {service.awsModelUrl}
              </p>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter>
          
        </CardFooter> */}
      </Card>
    </div>
  );
}
