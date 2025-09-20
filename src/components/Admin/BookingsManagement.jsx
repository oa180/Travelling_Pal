

import React, { useState } from "react";
import { Booking } from "@/entities/Booking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Search, 
  Calendar, 
  User, 
  DollarSign, 
  MapPin,
  Filter,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function BookingsManagement({ bookings, packages, companies, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getPackageInfo = (packageId) => {
    return packages.find(pkg => pkg.id === packageId) || { title: 'Unknown Package', destination: 'Unknown' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const packageInfo = getPackageInfo(booking.package_id);
    const matchesSearch = !searchQuery || 
      booking.traveler_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.traveler_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      packageInfo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      packageInfo.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.total_amount || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Bookings Management ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold">{bookingStats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{bookingStats.confirmed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{bookingStats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">${bookingStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => {
            const packageInfo = getPackageInfo(booking.package_id);
            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {packageInfo.title}
                        </h3>
                        <Badge className={`${getStatusColor(booking.status)} border flex items-center gap-1`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{booking.traveler_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{packageInfo.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {booking.travel_date ? format(new Date(booking.travel_date), 'MMM d, yyyy') : 'No date'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${booking.total_amount?.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">Email:</span> {booking.traveler_email}</p>
                        <p><span className="font-medium">Travelers:</span> {booking.number_of_travelers}</p>
                        {booking.traveler_phone && (
                          <p><span className="font-medium">Phone:</span> {booking.traveler_phone}</p>
                        )}
                        {booking.special_requests && (
                          <p><span className="font-medium">Special requests:</span> {booking.special_requests}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-2">
                        Booked {format(new Date(booking.created_date), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Payment: {booking.payment_method || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}