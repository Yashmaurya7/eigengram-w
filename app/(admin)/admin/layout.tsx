import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Eigengram",
  description:
    "EigenGram, the leading healthcare platform for all your medical health data and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen gap-1">
      <Sidebar isAdmin={true} />
      <div className="w-full pl-4 pr-2 pt-4">{children}</div>
    </div>
  );
}
