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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const settingsFormSchema = z.object({
  siteName: z
    .string()
    .min(2, {
      message: "Site name must be at least 2 characters.",
    })
    .max(30, {
      message: "Site name must not be longer than 30 characters.",
    }),
  description: z.string().max(160).min(4),
  url: z.string().url({ message: "Please enter a valid URL." }),
  enableRegistrations: z.boolean().default(true),
  enableNotifications: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const defaultValues: Partial<SettingsFormValues> = {
  siteName: "Eigengram",
  description: "AI-powered healthcare services platform",
  url: "https://eigengram.com",
  enableRegistrations: true,
  enableNotifications: true,
};

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings updated",
        description: "Your site settings have been updated successfully.",
      });
      console.log(data);
    }, 1000);
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
          <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your site settings and configurations. (This is a dummy page
          only)
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure the general settings for your site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="w-full flex gap-2 flex-col md:flex-row">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Eigengram" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name of your site that will be displayed
                          to users.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://eigengram.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the URL of your site.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="AI-powered healthcare services platform"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the description of your site that will be used for
                      SEO.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex gap-2 flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name="enableRegistrations"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Registrations
                        </FormLabel>
                        <FormDescription>
                          Allow new users to register on your site.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enableNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Notifications
                        </FormLabel>
                        <FormDescription>
                          Send email notifications for important events.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
