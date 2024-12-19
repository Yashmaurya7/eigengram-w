import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { db } from "@/lib/db";
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  import { ArrowLeft } from "lucide-react";
  
  export default async function FeatureRequestsPage() {
    const featureRequests = await db.featureRequest.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  
    return (
      <div className="space-y-6">
        <div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/admin">
                <ArrowLeft className="h-6 w-6" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold mb-6">Feature Requests</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            View and manage user-submitted feature requests and feedback.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Feature Requests</CardTitle>
            <CardDescription>
              A list of all feature requests submitted by users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featureRequests.map(
                  (request: {
                    id: string;
                    title: string;
                    description: string;
                    status: string;
                    user: { email: string };
                    createdAt: Date;
                  }) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.title}
                      </TableCell>
                      <TableCell>{request.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.status}</Badge>
                      </TableCell>
                      <TableCell>{request.user.email}</TableCell>
                      <TableCell>
                        {request.createdAt.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
  