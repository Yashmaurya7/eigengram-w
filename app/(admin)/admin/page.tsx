import { Button } from "@/components/ui/button";
import { allowedMails } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { PackagePlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { Service } from "@prisma/client";
import { authOptions } from "@/lib/auth";

async function ServiceList() {
  const services = await db.service.findMany();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service:Service) => (
        <Card key={service.id}>
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>${service.price.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{service.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const AdminPage = async () => {
  const session= await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    redirect("/sign-in");
  }

  if (!allowedMails.includes(user.email!)) {
    redirect("/not-authorised");
  } else {
    return (
      <>
        <div>
          <main className="flex-1 overflow-y-auto">
            <div className="w-full flex items-center justify-between">
              <h2 className="mb-6 text-2xl font-semibold">Services</h2>
              <Button asChild>
                <Link href={"/admin/new-service"} className="flex gap-2">
                  <PackagePlus />
                  <div className="font-medium">Add a new service</div>
                </Link>
              </Button>
            </div>
            <Suspense fallback={<div>Loading services...</div>}>
              <ServiceList />
            </Suspense>
          </main>
        </div>
      </>
    );
  }
};

export default AdminPage;
