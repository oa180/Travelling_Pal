
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Booking } from "@/entities/Booking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Package, Calendar, User, Mail, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function BookingConfirmation() {
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const bookingId = params.get('booking');
        if (bookingId) {
          const foundBooking = await Booking.get(bookingId);
          setBooking(foundBooking || null);
        }
      } catch (error) {
        console.error("Error loading booking details:", error);
      }
      setIsLoading(false);
    };
    fetchBooking();
  }, [location.search]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <Link to={createPageUrl("Home")}>
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600 mt-4">
            Thank you, {booking.traveler_name}! Your trip is booked.
          </p>
          <p className="mt-2 text-gray-500">
            A confirmation email has been sent to {booking.traveler_email}.
          </p>
        </div>

        <Card className="mt-12 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Itinerary</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Package</p>
                  <p className="font-medium text-gray-900 text-lg">{booking.package_title}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Travel Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.travel_date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Travelers</p>
                    <p className="font-medium text-gray-900">{booking.number_of_travelers}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount Paid</p>
                  <p className="font-bold text-gray-900 text-xl">${booking.total_amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <Link to={createPageUrl("Home")}>
            <Button size="lg" variant="outline">Plan Another Trip</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}