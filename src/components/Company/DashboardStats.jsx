import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Users, DollarSign, Star, Eye, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardStats({ stats, isLoading }) {
  const baseCards = [
    {
      title: "Total Packages",
      value: stats.totalPackages,
      icon: Package,
      color: "bg-blue-500",
      trend: "+0%"
    },
    {
      title: "Total Bookings", 
      value: stats.totalBookings,
      icon: Users,
      color: "bg-green-500",
      trend: "+8% this month"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
      trend: "+15% this month"
    },
    {
      title: "Average Rating",
      value: stats.averageRating || "N/A",
      icon: Star,
      color: "bg-yellow-500",
      trend: "4.8 avg rating"
    }
  ];

  const extraCards = [];
  if (typeof stats.impressions === "number") {
    extraCards.push({
      title: "Impressions",
      value: stats.impressions.toLocaleString(),
      icon: Eye,
      color: "bg-indigo-500",
      trend: "scope-wide",
    });
  }
  if (typeof stats.clicks === "number") {
    extraCards.push({
      title: "Clicks",
      value: stats.clicks.toLocaleString(),
      icon: TrendingUp,
      color: "bg-rose-500",
      trend: "scope-wide",
    });
  }
  const statCards = [...baseCards, ...extraCards];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {Array(6).fill(0).map((_, i) => (
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
        <Card key={stat.title} className="relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${stat.color} rounded-full opacity-10`} />
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-20`}>
                <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}