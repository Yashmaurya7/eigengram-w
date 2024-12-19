"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateUserAccount, createFeatureRequest } from "@/app/actions/user";
import { Role } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z.string().email(),
  phoneNumber: z.string().min(10).max(15),
});

const featureRequestSchema = z.object({
  title: z
    .string()
    .min(4, {
      message: "Title must be at least 4 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  description: z.string().min(10).max(500),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;
type FeatureRequestValues = z.infer<typeof featureRequestSchema>;
type AccountPageProps = {
  user: {
    id: string;
    email: string;
    username: string;
    phoneNumber: string | null;
    name: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  };
};

export default function AccountPage({
  user,
}: AccountPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user.name || "", // Provide empty string as fallback
      email: user.email || "", // Provide empty string as fallback
      phoneNumber: user.phoneNumber || "", // Provide empty string as fallback
    },
  });

  const featureRequestForm = useForm<FeatureRequestValues>({
    resolver: zodResolver(featureRequestSchema),
    defaultValues: {
      title: "", // Initialize with empty string
      description: "", // Initialize with empty string
    },
  });

  async function onSubmit(data: AccountFormValues) {
    setIsLoading(true);
    try {
      const result = await updateUserAccount(user.id, data);
      if (result.success) {
        toast({
          title: "Account updated",
          description: "Your account has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  async function onFeatureRequestSubmit(data: FeatureRequestValues) {
    setIsLoading(true);
    try {
      const result = await createFeatureRequest(user.id, data);
      if (result.success) {
        toast({
          title: "Feature request submitted",
          description: "Your feature request has been submitted successfully.",
        });
        featureRequestForm.reset({
          title: "", // Reset to empty string
          description: "", // Reset to empty string
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex gap-2">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/admin">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div><h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and set your preferences.
          </p></div>
        </div>
        
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div className="w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            value={field.value || ""} // Ensure value is never undefined
                          />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed on your
                          profile and in emails.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your email"
                            {...field}
                            value={field.value || ""} // Ensure value is never undefined
                            disabled
                          />
                        </FormControl>
                        <FormDescription>
                          This is the email address you use to log in.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your phone number"
                            {...field}
                            value={field.value || ""} // Ensure value is never undefined
                          />
                        </FormControl>
                        <FormDescription>
                          Your contact phone number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Feature Request</CardTitle>
            <CardDescription>
              Submit a feature request or provide feedback to the admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...featureRequestForm}>
              <form
                onSubmit={featureRequestForm.handleSubmit(
                  onFeatureRequestSubmit
                )}
                className="space-y-8"
              >
                <div>
                  <FormField
                    control={featureRequestForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Feature request title"
                            {...field}
                            value={field.value || ""} // Ensure value is never undefined
                          />
                        </FormControl>
                        <FormDescription>
                          A brief title for your feature request.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={featureRequestForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the feature you'd like to see"
                            className="resize-none"
                            {...field}
                            value={field.value || ""} // Ensure value is never undefined
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about the feature you&apos;re requesting.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Feature Request"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
