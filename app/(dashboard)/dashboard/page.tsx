import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function ServiceList({ userId }: { userId: string }) {
  const services = await db.service.findMany({
    where: { isActive: true },
    include: {
      subscriptions: {
        where: { userId },
      },
    },
  });

  return (
    <div>
        
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const subscription = service.subscriptions[0];
          return (
            <Card
              key={service.id}
              className="hover:shadow dark:hover:shadow-white/20 hover:shadow-black/40"
            >
              <Link href={`/services/${service.id}`}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>${service.price.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{service.description}</p>
                  {subscription ? (
                    <div className="text-sm text-muted-foreground">
                      Status: {subscription.status}
                    </div>
                  ) : (
                    <Button className="">View Details</Button>
                  )}
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

async function SubscribedServices({ userId }: { userId: string }) {
  const subscriptions = await db.subscription.findMany({
    where: {
      userId,
      status: "ACTIVE",
    },
    include: {
      service: true,
    },
  });

  if (subscriptions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No active subscriptions found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {subscriptions.map(({ service }) => (
        <Card
          key={service.id}
          className="hover:shadow dark:hover:shadow-white/20 hover:shadow-black/40"
        >
          <Link href={`/services/${service.id}`}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>${service.price.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{service.description}</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}

export default async function UserDashboard() {
 const session=await getServerSession(authOptions);
 const user=session?.user;

  if (!user) {
    redirect("/");
  }

  const dbUser = await db.user.findUnique({
    where: { email:user.email|| "" },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-y-auto  ">
    <div className="flex gap-2 items-center mb-6">
      <Button asChild variant="ghost">
        <Link href="/admin">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </Button>
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
        <Tabs defaultValue="subscribed" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subscribed">My Subscriptions</TabsTrigger>
            <TabsTrigger value="available">Available Services</TabsTrigger>
          </TabsList>
          <TabsContent value="available">
            <Suspense fallback={<div>Loading services...</div>}>
              <ServiceList userId={dbUser.id} />
            </Suspense>
          </TabsContent>
          <TabsContent value="subscribed">
            <Suspense fallback={<div>Loading subscriptions...</div>}>
              <SubscribedServices userId={dbUser.id} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
