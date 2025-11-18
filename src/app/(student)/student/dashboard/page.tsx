"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-provider";

export default function StudentDashboard() {
  const { user } = useAuthContext();

  const stats = [
    {
      name: "Total Documents",
      value: "0",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      name: "Pending Review",
      value: "0",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      name: "Verified",
      value: "0",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      name: "Rejected",
      value: "0",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10">
        <h2 className="text-3xl font-bold">Welcome back, {user?.name}!</h2>
        <p className="mt-3 text-muted-foreground text-lg">
          {user?.enrollmentNumber && `Enrollment: ${user.enrollmentNumber} | `}
          {user?.course && `${user.course}`}
          {user?.year && ` - Year ${user.year}`}
        </p>
        <Button className="mt-6" size="lg">
          <Upload className="mr-2 h-5 w-5" />
          Upload New Document
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <div className={`rounded-full p-2.5 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Connect backend to see live data
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-12 text-base">
              <Upload className="mr-2 h-5 w-5" />
              Upload Document
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-base">
              <FileText className="mr-2 h-5 w-5" />
              View My Documents
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No documents uploaded yet. Start by uploading your first document!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
