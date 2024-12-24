import AccountPage from "@/components/AccountsPage";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Accounts = async () => {
    const session=await getServerSession(authOptions);
    const user=session?.user;

  if (!user) {
    redirect("/api/auth/login");
  }

  const dbUser = await db.user.findUnique({
    where: { email: user.email||"" },
  });

  return (
    <div>
      <AccountPage user={dbUser!} />
    </div>
  );
};

export default Accounts;
