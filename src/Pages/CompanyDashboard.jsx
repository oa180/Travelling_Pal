import React, { useState, useEffect } from "react";
import { TravelPackage, Booking, Company, User } from "@/entities/all";
import { Plus, Package, TrendingUp, Users, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashboardStats from "../components/company/DashboardStats";
import PackageManagement from "../components/company/PackageManagement";
import BookingsOverview from "../components/company/BookingsOverview";
import AddPackageModal from "../components/company/AddPackageModal";
import CompanyProfile from "../components/company/CompanyProfile";

export default function CompanyDashboard() {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    searchAppearances: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Get or create company profile
      let userCompany = await Company.filter({ created_by: currentUser.email });
      if (userCompany.length === 0) {
        // Create default company if none exists
        userCompany = await Company.create({
          company_name: "My Travel Company",
          company_type: "travel_agency",
          contact_email: currentUser.email,
          description: "Add your company description here",
          is_active: true
        });
        setCompany(userCompany);
      } else {
        setCompany(userCompany[0]);
      }

      // Load packages for this company
      const companyPackages = await TravelPackage.filter({ 
        created_by: currentUser.email 
      }, '-created_date');
      setPackages(companyPackages);

      // Load bookings for this company's packages
      const packageIds = companyPackages.map(pkg => pkg.id);
      let companyBookings = [];
      if (packageIds.length > 0) {
        companyBookings = await Booking.list('-created_date');
        companyBookings = companyBookings.filter(booking => 
          packageIds.includes(booking.package_id)
        );
      }
      setBookings(companyBookings);

      // Calculate stats
      const totalRevenue = companyBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
      
      const averageRating = companyPackages.length > 0 
        ? companyPackages.reduce((sum, pkg) => sum + (pkg.star_rating || 0), 0) / companyPackages.length
        : 0;

      setStats({
        totalPackages: companyPackages.length,
        totalBookings: companyBookings.length,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
        searchAppearances: companyPackages.length * 15 // Simulated metric
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const handleAddPackage = async (packageData) => {
    try {
      const newPackage = await TravelPackage.create({
        ...packageData,
        provider_name: company?.company_name || "My Travel Company"
      });
      setPackages(prev => [newPackage, ...prev]);
      setShowAddPackage(false);
      loadDashboardData(); // Refresh stats
    } catch (error) {
      console.error("Error adding package:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {company?.company_name || "Travel Partner"}
            </p>
          </div>
          <Button
            onClick={() => setShowAddPackage(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Package
          </Button>
        </div>

        {/* Stats Cards */}
        <DashboardStats stats={stats} isLoading={isLoading} />

        {/* Main Content */}
        <div className="mt-8">
          <Tabs defaultValue="packages" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6">
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Packages</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="packages">
              <PackageManagement 
                packages={packages}
                onRefresh={loadDashboardData}
              />
            </TabsContent>

            <TabsContent value="bookings">
              <BookingsOverview 
                bookings={bookings}
                packages={packages}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      Revenue chart will be displayed here
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Destinations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {packages.slice(0, 5).map((pkg) => (
                        <div key={pkg.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{pkg.destination}</p>
                            <p className="text-sm text-gray-500">{pkg.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${pkg.price}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                              {pkg.star_rating}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <CompanyProfile 
                company={company}
                onUpdate={loadDashboardData}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Package Modal */}
        <AddPackageModal
          open={showAddPackage}
          onClose={() => setShowAddPackage(false)}
          onSubmit={handleAddPackage}
        />
      </div>
    </div>
  );
}