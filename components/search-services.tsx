"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requestSubscription } from "@/app/actions/subscriptions";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight } from "lucide-react";

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
};

export function SearchServices({
  initialServices,
  userId,
}: {
  initialServices: Service[];
  userId: string;
}) {
  const [services, setServices] = useState(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleSearch = useCallback(() => {
    const filtered = initialServices.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setServices(filtered);
  }, [initialServices, searchTerm]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSubscribe = async (e: React.MouseEvent, serviceId: string) => {
    e.preventDefault(); // Prevent the link from being followed
    try {
      const result = await requestSubscription({ userId, serviceId });
      if (result.success) {
        toast({
          title: "Subscription requested",
          description:
            "Your subscription request has been submitted successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request subscription. Please try again.",
        variant: "destructive",
      });
      console.log("Error: ",error)
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Input
          type="text"
          placeholder="Search services that you are not subscribed to..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Enter</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service.id}
            className="hover:shadow dark:hover:shadow-white/20 hover:shadow-black/40"
          >
            <Link href={`/services/${service.id}`}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>${service.price}</CardDescription>
                </div>
                <ArrowUpRight />
              </CardHeader>
              <CardContent>
                <p className="mb-4">{service.description}</p>
                <Button onClick={(e) => handleSubscribe(e, service.id)}>
                  Request Subscription
                </Button>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}