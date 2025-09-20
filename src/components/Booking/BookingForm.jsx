

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

export default function BookingForm({ user, onSubmit, isProcessing }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.full_name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Traveler Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="specialRequests">Special Requests (optional)</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="e.g., Dietary restrictions, accessibility needs, etc."
              rows={3}
            />
          </div>
          <div className="pt-4 border-t">
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold"
            >
              {isProcessing ? "Processing..." : "Confirm & Book Now"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}