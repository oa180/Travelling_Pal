
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Package, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function BookingsOverview({ bookings, packages }) {
  const getPackageTitle = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    return pkg?.title || "Unknown Package";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-600">
            Bookings will appear here when customers book your packages
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings ({bookings.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {getPackageTitle(booking.package_id)}
                    </h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{booking.traveler_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {booking.travel_date ? format(new Date(booking.travel_date), 'MMM d, yyyy') : 'No date'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4" />
                      <span>{booking.number_of_travelers} travelers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">${booking.total_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Email:</span> {booking.traveler_email}</p>
                    {booking.traveler_phone && (
                      <p><span className="font-medium">Phone:</span> {booking.traveler_phone}</p>
                    )}
                    {booking.special_requests && (
                      <p><span className="font-medium">Special requests:</span> {booking.special_requests}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Booked {format(new Date(booking.created_date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}