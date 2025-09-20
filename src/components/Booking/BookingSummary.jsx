


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Added this import
import { MapPin, Calendar, Users, DollarSign, Minus, Plus } from "lucide-react";
import { format } from "date-fns";

export default function BookingSummary({ pkg, travelers, setTravelers, selectedDate, setSelectedDate }) {
  const totalPrice = pkg.price * travelers;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={pkg.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80&h=80&fit=crop'} 
              alt={pkg.destination}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{pkg.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{pkg.destination}, {pkg.country}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <Label htmlFor="travelDate">Travel Date</Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger id="travelDate">
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {pkg.available_dates && pkg.available_dates.length > 0 ? (
                  pkg.available_dates.map(date => (
                    <SelectItem key={date} value={date}>
                      {format(new Date(date), 'MMM d, yyyy')}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={null} disabled>No dates available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Number of Travelers</Label>
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-medium">{travelers}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTravelers(Math.min(pkg.max_travelers || 10, travelers + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between items-center text-gray-600">
            <span>{travelers} traveler(s) x ${pkg.price.toLocaleString()}</span>
            <span>${(pkg.price * travelers).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Taxes & Fees</span>
            <span>Included</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-3 border-t">
            <span>Total</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
