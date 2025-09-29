import React, { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Package, TrendingUp, Users, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyAnalyticsAPI } from "@/api";
import FiltersBar from "@/components/Company/FiltersBar";
import TimeSeriesChart from "@/components/Company/TimeSeriesChart";
import ComboChart from "@/components/Company/ComboChart";
import DonutChart from "@/components/Company/DonutChart";
import TopPackagesTable from "@/components/Company/TopPackagesTable";
import RecentBookingsList from "@/components/Company/RecentBookingsList";
import FunnelChart from "@/components/Company/FunnelChart";
import Heatmap from "@/components/Company/Heatmap";
import { useAuth } from "@/contexts/AuthContext";

import DashboardStats from "../components/Company/DashboardStats";
import PackageManagement from "../components/Company/PackageManagement";
import BookingsOverview from "../components/Company/BookingsOverview";
import AddPackageModal from "../components/Company/AddPackageModal";
import CompanyProfile from "../components/Company/CompanyProfile";

export default function CompanyDashboard() {
  const { user: authUser } = useAuth();
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
    searchAppearances: 0,
  });

  // Analytics state
  const [filters, setFilters] = useState(() => {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 45); // widen default window to include recent seeds
    const to = new Date();
    to.setDate(today.getDate() + 14); // include near-future dates (e.g., 2025-10-02/05)
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    try {
      const saved = localStorage.getItem("company_dashboard_filters");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { from: fmt(from), to: fmt(to), companyId: authUser?.companyId ?? null, packageId: null, destination: null };
  });
  const [summary, setSummary] = useState(null);
  const [topPackagesData, setTopPackagesData] = useState([]);
  const [recentBookingsData, setRecentBookingsData] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [errorAnalytics, setErrorAnalytics] = useState("");

  useEffect(() => {
    // Seed minimal company from auth user
    if (authUser) {
      setCompany((prev) => ({
        id: authUser.companyId ?? prev?.id ?? null,
        company_name: prev?.company_name || "My Travel Company",
        company_type: prev?.company_type || "travel_agency",
        contact_email: authUser.email || prev?.contact_email || "",
        is_active: true,
      }));
      // Ensure filters carry companyId only if not already set
      setFilters((f) => (f.companyId == null && authUser.companyId != null ? { ...f, companyId: authUser.companyId } : f));
      setIsLoading(false);
    }
  }, [authUser]);

  // Persist filters
  useEffect(() => {
    try { localStorage.setItem("company_dashboard_filters", JSON.stringify(filters)); } catch {}
  }, [filters]);

  // Fetch analytics when filters are ready (debounced)
  useEffect(() => {
    if (!filters.from || !filters.to) return;
    const params = {
      from: filters.from,
      to: filters.to,
      packageId: filters.packageId || undefined,
      destination: filters.destination || undefined,
    };
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoadingAnalytics(true);
      setErrorAnalytics("");
      try {
        if (import.meta?.env?.VITE_DEBUG_API === 'true') {
          // eslint-disable-next-line no-console
          console.log('[Analytics] Fetch', params);
        }
        const [sum, tops, rec] = await Promise.all([
          CompanyAnalyticsAPI.getSummary(params),
          CompanyAnalyticsAPI.getTopPackages({ from: filters.from, to: filters.to, sort: "revenue", limit: 20 }),
          CompanyAnalyticsAPI.getRecentBookings({ from: filters.from, to: filters.to, limit: 20 }),
        ]);
        if (cancelled) return;
        setSummary(sum || null);
        setTopPackagesData(Array.isArray(tops?.items) ? tops.items : []);
        setRecentBookingsData(Array.isArray(rec?.items) ? rec.items : []);
        setStats((prev) => ({
          ...prev,
          totalRevenue: Number(sum?.revenueTotal || 0),
          totalBookings: Number(sum?.bookingsTotal || 0),
        }));
      } catch (e) {
        if (!cancelled) setErrorAnalytics(e?.body?.message || e?.message || "Failed to load analytics");
      } finally {
        if (!cancelled) setLoadingAnalytics(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [filters.from, filters.to, filters.packageId, filters.destination]);

  // No-op now (legacy entity calls removed)
  const loadDashboardData = async () => {};

  const handleAddPackage = async (packageData) => {
    try {
      const newPackage = await TravelPackage.create({
        ...packageData,
        provider_name: company?.company_name || "My Travel Company",
      });
      setPackages((prev) => [newPackage, ...prev]);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Company Dashboard
            </h1>
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

        {/* Filters */}
        <div className="mb-6">
          <FiltersBar
            companyId={filters.companyId || company?.id || authUser?.companyId}
            value={filters}
            onChange={(v) => setFilters((prev) => ({ ...prev, ...v }))}
            testId="filters-bar"
          />
        </div>

        {/* Stats Cards (map from analytics summary when ready) */}
        <DashboardStats
          stats={{
            totalPackages: stats.totalPackages,
            totalBookings: summary?.bookingsTotal ?? stats.totalBookings,
            totalRevenue: summary?.revenueTotal ?? stats.totalRevenue,
            averageRating: stats.averageRating,
          }}
          isLoading={isLoading || loadingAnalytics}
        />

        {/* Main Content */}
        <div className="mt-8">
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6">
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Packages</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
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
              <BookingsOverview bookings={bookings} packages={packages} />
            </TabsContent>

            <TabsContent value="analytics">
              {errorAnalytics && (
                <Card className="mb-4">
                  <CardContent className="p-4 text-sm text-red-600">{errorAnalytics}</CardContent>
                </Card>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TimeSeriesChart
                  title="Revenue"
                  series={[{ label: "Revenue", data: summary?.timeSeries?.revenue || [] }]}
                  testId="chart-revenue"
                />
                <TimeSeriesChart
                  title="Bookings"
                  series={[{ label: "Bookings", data: summary?.timeSeries?.bookings || [] }]}
                  testId="chart-bookings"
                />
                <ComboChart
                  title="Impressions vs Clicks"
                  bars={[
                    { label: "Impressions", data: summary?.timeSeries?.impressions || [] },
                    { label: "Clicks", data: summary?.timeSeries?.clicks || [] },
                  ]}
                  testId="chart-imp-clicks"
                />
                <DonutChart
                  title="Booking Status"
                  items={summary?.statusDistribution || []}
                  testId="chart-status"
                />
                <FunnelChart
                  title="Conversion Funnel"
                  funnel={summary?.funnel || {}}
                  testId="chart-funnel"
                />
                <Heatmap
                  title="Bookings by Month"
                  items={summary?.byMonth || []}
                  testId="chart-heatmap"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <TopPackagesTable
                  items={topPackagesData}
                  onRowClick={(row) => setFilters((p) => ({ ...p, packageId: row.packageId }))}
                  testId="top-packages-table"
                />
                <RecentBookingsList items={recentBookingsData} testId="recent-bookings" />
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <CompanyProfile company={company} onUpdate={loadDashboardData} />
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
