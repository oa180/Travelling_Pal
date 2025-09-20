
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Building, 
  Package, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2,
  Globe,
  Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminStats({ stats, isLoading }) {
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      trend: `+${Math.max(0, Math.round(stats.monthlyGrowth))}% this month`,
      subtitle: "Registered travelers"
    },
    {
      title: "Travel Companies", 
      value: stats.totalCompanies.toLocaleString(),
      icon: Building,
      color: "bg-green-500",
      trend: `${stats.verifiedCompanies} verified`,
      subtitle: "Active partners"
    },
    {
      title: "Total Packages",
      value: stats.totalPackages.toLocaleString(),
      icon: Package,
      color: "bg-purple-500", 
      trend: `${stats.activePackages} active`,
      subtitle: "Available destinations"
    },
    {
      title: "Platform Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      trend: `${stats.totalBookings} bookings`,
      subtitle: "Total processed"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg">
          <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${stat.color} rounded-full opacity-10`} />
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.subtitle}
                </p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  <span className="text-green-600 font-medium">
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-20`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}