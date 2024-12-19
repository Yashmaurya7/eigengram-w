import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { allowedMails } from "@/lib/constants";
import { UserList } from "../../_components/user-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function AdminUsers() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user || !allowedMails.includes(user.email!)) {
    redirect("/");
  }

  const users = await db.user.findMany({
    include: {
      _count: {
        select: { subscriptions: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const transformedUsers = users.map((user) => ({
    ...user,
    phoneNumber: user.phoneNumber ?? "", // Replace null with an empty string
  }));

  return (
    <div className="container mx-auto">
      <div className="flex gap-2 items-center mb-6">
        <Button asChild variant="ghost">
          <Link href="/admin">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <p className="mb-4 text-muted-foreground">Total Users: <span className="font-bold">{users.length}</span></p>
      <UserList users={transformedUsers} />
    </div>
  );
}
