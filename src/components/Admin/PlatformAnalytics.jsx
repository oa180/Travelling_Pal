

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from "recharts";
import { MapPin, TrendingUp, Calendar, Globe } from "lucide-react";

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export default function PlatformAnalytics({ bookings, packages, companies, users, focusView }) {
  // Revenue by month
  const getMonthlyRevenue = () => {
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months
    months.forEach((month, index) => {
      monthlyData[month] = { month, revenue: 0, bookings: 0 };
    });

    bookings.forEach(booking => {
      if (booking.status === 'confirmed' && booking.created_date) {
        const month = new Date(booking.created_date).getMonth();
        const monthName = months[month];
        monthlyData[monthName].revenue += booking.total_amount || 0;
        monthlyData[monthName].bookings += 1;
      }
    });

    return Object.values(monthlyData);
  };

  // Top destinations
  const getTopDestinations = () => {
    const destinations = {};
    packages.forEach(pkg => {
      const dest = pkg.destination || 'Unknown';
      if (!destinations[dest]) {
        destinations[dest] = { name: dest, packages: 0, bookings: 0, revenue: 0 };
      }
      destinations[dest].packages += 1;
      
      // Count bookings and revenue for this destination
      const destBookings = bookings.filter(b => b.package_id === pkg.id);
      destinations[dest].bookings += destBookings.length;
      destinations[dest].revenue += destBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);
    });

    return Object.values(destinations)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Company performance
  const getCompanyPerformance = () => {
    const companyStats = {};
    
    companies.forEach(company => {
      companyStats[company.id] = {
        name: company.company_name || 'Unknown',
        packages: 0,
        bookings: 0,
        revenue: 0
      };
    });

    packages.forEach(pkg => {
      const companyId = pkg.provider_id || 'unknown';
      if (companyStats[companyId]) {
        companyStats[companyId].packages += 1;
      }
    });

    bookings.forEach(booking => {
      const pkg = packages.find(p => p.id === booking.package_id);
      if (pkg && companyStats[pkg.provider_id]) {
        companyStats[pkg.provider_id].bookings += 1;
        if (booking.status === 'confirmed') {
          companyStats[pkg.provider_id].revenue += booking.total_amount || 0;
        }
      }
    });

    return Object.values(companyStats)
      .filter(c => c.packages > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  };

  // Package types distribution
  const getAccommodationDistribution = () => {
    const distribution = {};
    packages.forEach(pkg => {
      const level = pkg.accommodation_level || 'unknown';
      distribution[level] = (distribution[level] || 0) + 1;
    });

    return Object.entries(distribution).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      value 
    }));
  };

  const monthlyRevenue = getMonthlyRevenue();
  const topDestinations = getTopDestinations();
  const companyPerformance = getCompanyPerformance();
  const accommodationDistribution = getAccommodationDistribution();

  if (focusView === "destinations") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Top Destinations Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topDestinations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : value,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]} />
                <Bar dataKey="revenue" fill="#3B82F6" />
                <Bar dataKey="bookings" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Destinations by Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDestinations.slice(0, 6).map((dest, index) => (
                  <div key={dest.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded`} style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="font-medium">{dest.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{dest.packages} packages</p>
                      <p className="text-sm text-gray-500">{dest.bookings} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accommodation Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={accommodationDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accommodationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Revenue & Bookings Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `$${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Bookings'
              ]} />
              <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Top Destinations by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDestinations.slice(0, 6).map((dest, index) => (
                <div key={dest.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded`} style={{ backgroundColor: COLORS[index] }}></div>
                    <div>
                      <p className="font-medium">{dest.name}</p>
                      <p className="text-sm text-gray-500">{dest.packages} packages</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${dest.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{dest.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyPerformance.slice(0, 6).map((company, index) => (
                <div key={company.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded`} style={{ backgroundColor: COLORS[index] }}></div>
                    <div>
                      <p className="font-medium truncate">{company.name}</p>
                      <p className="text-sm text-gray-500">{company.packages} packages</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${company.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{company.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accommodation Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Package Distribution by Accommodation Level</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={accommodationDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {accommodationDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}