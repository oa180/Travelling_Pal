import React, { useState, useEffect } from "react";
import { TravelPackage, Booking, Company, User } from "@/entities/all";
import {
  Users,
  Building,
  Package,
  DollarSign,
  TrendingUp,
  Globe,
  Shield,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AdminStats from "../components/Admin/AdminStats";
import CompanyManagement from "../components/Admin/CompanyManagement";
import PlatformAnalytics from "../components/Admin/PlatformAnalytics";
import UserManagement from "../components/Admin/UserManagement";
import BookingsManagement from "../components/Admin/BookingsManagement";
import PlatformSettings from "../components/Admin/PlatformSettings";

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalPackages: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activePackages: 0,
    verifiedCompanies: 0,
    monthlyGrowth: 0,
  });
  const [companies, setCompanies] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // Check if user is admin
      const user = await User.me();
      setCurrentUser(user);

      // Load all platform data
      const [allCompanies, allPackages, allBookings, allUsers] =
        await Promise.all([
          Company.list("-created_date"),
          TravelPackage.list("-created_date"),
          Booking.list("-created_date"),
          User.list("-created_date"),
        ]);

      setCompanies(allCompanies);
      setPackages(allPackages);
      setBookings(allBookings);
      setUsers(allUsers);

      // Calculate platform statistics
      const totalRevenue = allBookings
        .filter((b) => b.status === "confirmed")
        .reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

      const activePackages = allPackages.filter((pkg) => pkg.is_active).length;
      const verifiedCompanies = allCompanies.filter(
        (company) => company.is_verified
      ).length;

      // Calculate monthly growth (simplified)
      const currentMonth = new Date().getMonth();
      const currentMonthBookings = allBookings.filter(
        (booking) => new Date(booking.created_date).getMonth() === currentMonth
      ).length;
      const lastMonthBookings = allBookings.filter(
        (booking) =>
          new Date(booking.created_date).getMonth() === currentMonth - 1
      ).length;
      const monthlyGrowth =
        lastMonthBookings > 0
          ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) *
            100
          : 0;

      setStats({
        totalUsers: allUsers.length,
        totalCompanies: allCompanies.length,
        totalPackages: allPackages.length,
        totalBookings: allBookings.length,
        totalRevenue,
        activePackages,
        verifiedCompanies,
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      });
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
    setIsLoading(false);
  };

  // Check if user has admin access
  if (currentUser && currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need admin privileges to access this panel.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              Admin Panel
            </h1>
            <p className="text-gray-600 mt-1">
              Platform management and analytics
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="font-medium text-gray-900">
              {currentUser?.full_name || currentUser?.email}
            </p>
          </div>
        </div>

        {/* Platform Stats */}
        <AdminStats stats={stats} isLoading={isLoading} />

        {/* Main Content Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="companies"
                className="flex items-center gap-2"
              >
                <Building className="w-4 h-4" />
                <span className="hidden sm:inline">Companies</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="destinations"
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Destinations</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <PlatformAnalytics
                bookings={bookings}
                packages={packages}
                companies={companies}
                users={users}
              />
            </TabsContent>

            <TabsContent value="companies">
              <CompanyManagement
                companies={companies}
                packages={packages}
                bookings={bookings}
                onRefresh={loadAdminData}
              />
            </TabsContent>

            <TabsContent value="bookings">
              <BookingsManagement
                bookings={bookings}
                packages={packages}
                companies={companies}
                onRefresh={loadAdminData}
              />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement users={users} onRefresh={loadAdminData} />
            </TabsContent>

            <TabsContent value="destinations">
              <PlatformAnalytics
                bookings={bookings}
                packages={packages}
                companies={companies}
                users={users}
                focusView="destinations"
              />
            </TabsContent>

            <TabsContent value="settings">
              <PlatformSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
