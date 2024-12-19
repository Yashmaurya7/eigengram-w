import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddServiceForm } from "../../_components/add-service-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NewService = () => {
  return (
    <div className="min-h-screen">
      <div className="flex gap-2 items-center mb-6">
        <Button asChild variant="ghost">
          <Link href="/admin">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">New Service</h1>
      </div>
      <Card className="mb-6 w-full flex-1 items-center">
        <CardHeader>
          <CardTitle>Add New Service</CardTitle>
          <CardDescription>
            Create a new healthcare service with AI model integration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddServiceForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewService;
