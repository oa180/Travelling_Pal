import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TravelPackage, Booking } from "@/entities/all";
import { User } from "@/entities/User";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";

import BookingForm from "../components/Booking/BookingForm";
import BookingSummary from "../components/Booking/BookingSummary";
import PaymentOptions from "../components/Booking/PaymentOptions";
import { Button } from "@/components/ui/button";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pkg, setPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        const params = new URLSearchParams(location.search);
        const packageId = params.get("package");

        if (packageId) {
          // In a real app, you would fetch a single package by ID
          // TravelPackage.get(packageId)
          // For now, we list and filter
          const allPackages = await TravelPackage.list();
          const foundPackage = allPackages.find((p) => p.id === packageId);
          setPackage(foundPackage);
          if (foundPackage?.available_dates?.length > 0) {
            setSelectedDate(foundPackage.available_dates[0]);
          }
        }
      } catch (error) {
        console.error("Error loading package details:", error);
      }
      setIsLoading(false);
    };

    fetchPackage();
  }, [location.search]);

  const handleBooking = async (formData) => {
    if (!pkg || isProcessing) return;

    setIsProcessing(true);
    try {
      const totalAmount = pkg.price * travelers;

      const bookingData = {
        package_id: pkg.id,
        package_title: pkg.title,
        traveler_name: formData.fullName,
        traveler_email: formData.email,
        traveler_phone: formData.phone,
        number_of_travelers: travelers,
        travel_date: selectedDate,
        total_amount: totalAmount,
        status: "confirmed", // Simulating confirmed booking
        payment_method: paymentMethod,
        special_requests: formData.specialRequests,
        provider_id: pkg.provider_id,
        provider_name: pkg.provider_name,
      };

      const newBooking = await Booking.create(bookingData);
      navigate(createPageUrl(`BookingConfirmation?booking=${newBooking.id}`));
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("There was an error creating your booking. Please try again.");
    }
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Package Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The travel package you are looking for does not exist or has been
            removed.
          </p>
          <Link to={createPageUrl("SearchResults")}>
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            to={createPageUrl("SearchResults")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search Results
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 mt-1">
            You're just a few steps away from your next adventure!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Form and Payment */}
          <div className="lg:col-span-2 space-y-8">
            <BookingForm
              user={user}
              onSubmit={handleBooking}
              isProcessing={isProcessing}
            />
            <PaymentOptions
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />
          </div>

          {/* Right Column: Summary */}
          <div className="sticky top-24">
            <BookingSummary
              pkg={pkg}
              travelers={travelers}
              setTravelers={setTravelers}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            <div className="mt-6 text-sm text-gray-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
              <span>Secure booking &amp; trusted payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
