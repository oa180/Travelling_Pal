
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

const TRANSPORT_OPTIONS = ["flight", "bus", "train", "car"];
const ACCOMMODATION_LEVELS = ["budget", "standard", "luxury", "premium"];
const CONTINENTS = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];

export default function AddPackageModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    price: "",
    original_price: "",
    image_url: "",
    duration_days: "",
    star_rating: "4.0",
    transport_type: "flight",
    accommodation_level: "standard",
    max_travelers: "4",
    country: "",
    continent: "Asia",
    includes: [],
    available_dates: []
  });
  
  const [newInclude, setNewInclude] = useState("");
  const [newDate, setNewDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Theme-aware field styles (light default, dark overrides)
  const fieldClass = "bg-white text-gray-400 border-gray-300";
  const labelClass = "text-gray-200 dark:text-gray-400";

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()]
      }));
      setNewInclude("");
    }
  };

  const removeInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const addDate = () => {
    if (newDate) {
      setFormData(prev => ({
        ...prev,
        available_dates: [...prev.available_dates, newDate]
      }));
      setNewDate("");
    }
  };

  const removeDate = (index) => {
    setFormData(prev => ({
      ...prev,
      available_dates: prev.available_dates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Map UI form to API payload fields for /company/offers
      const toNumber = (v) => (v === "" || v == null ? undefined : Number(v));
      const apiPayload = {
        title: formData.title || undefined,
        description: formData.description || undefined,
        price: toNumber(formData.price),
        seats: toNumber(formData.max_travelers),
        // Dates: prefer available_dates[0]/[1] when provided; fallbacks optional
        startDate: formData.available_dates?.[0] || undefined,
        endDate: formData.available_dates?.[1] || undefined,
        destination: formData.destination || undefined,
        kind: "TRIP",
        // companyId omitted to rely on JWT override (backend note)
        originalPrice: toNumber(formData.original_price),
        imageUrl: formData.image_url || undefined,
        availableDates: Array.isArray(formData.available_dates) ? formData.available_dates : undefined,
        durationDays: toNumber(formData.duration_days),
        starRating: formData.star_rating ? Number(formData.star_rating) : undefined,
        transportType: formData.transport_type || undefined,
        accommodationLevel: formData.accommodation_level || undefined,
        maxTravelers: toNumber(formData.max_travelers),
        includes: Array.isArray(formData.includes) ? formData.includes : undefined,
        // Provider fields optional; leave undefined unless you capture them in UI
        providerId: undefined,
        providerName: undefined,
        isActive: true,
        country: formData.country || undefined,
        continent: formData.continent || undefined,
      };

      await onSubmit(apiPayload);
      
      // Reset form
      setFormData({
        title: "",
        destination: "",
        description: "",
        price: "",
        original_price: "",
        image_url: "",
        duration_days: "",
        star_rating: "4.0",
        transport_type: "flight",
        accommodation_level: "standard",
        max_travelers: "4",
        country: "",
        continent: "Asia",
        includes: [],
        available_dates: []
      });
    } catch (error) {
      console.error("Error creating package:", error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl md:max-w-4xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur border border-gray-200 sm:rounded-2xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold  text-gray-500">Add New Travel Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="col-span-2">
              <Label htmlFor="title" className={labelClass}>Package Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Bali Paradise Getaway"
                required
                className={fieldClass}
              />
            </div>

            <div>
              <Label htmlFor="destination" className={labelClass}>Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder="e.g., Bali, Indonesia"
                required
                className={fieldClass}
              />
            </div>

            <div>
              <Label htmlFor="country" className={labelClass}>Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="e.g., Indonesia"
                className={fieldClass}
              />
            </div>

            <div>
              <Label htmlFor="continent" className={labelClass}>Continent</Label>
              <Select value={formData.continent} onValueChange={(value) => handleInputChange('continent', value)}>
                <SelectTrigger className={`w-full ${fieldClass}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTINENTS.map(continent => (
                    <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price" className={labelClass}>Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="999"
                required
                className={fieldClass}
              />
            </div>

            <div>
              <Label htmlFor="original_price" className={labelClass}>Original Price (optional)</Label>
              <Input
                id="original_price"
                type="number"
                value={formData.original_price}
                onChange={(e) => handleInputChange('original_price', e.target.value)}
                placeholder="1299"
                className={fieldClass}
              />
            </div>

            <div>
              <Label htmlFor="duration_days" className={labelClass}>Duration (days) *</Label>
              <Input
                id="duration_days"
                type="number"
                value={formData.duration_days}
                onChange={(e) => handleInputChange('duration_days', e.target.value)}
                placeholder="7"
                required
                className={fieldClass}
              />
            </div>

            <div>
              <Label htmlFor="max_travelers" className={labelClass}>Max Travelers</Label>
              <Input
                id="max_travelers"
                type="number"
                value={formData.max_travelers}
                onChange={(e) => handleInputChange('max_travelers', e.target.value)}
                placeholder="4"
                className={fieldClass}
              />
            </div>

            <div>
              <Label htmlFor="star_rating" className={labelClass}>Rating</Label>
              <Select value={formData.star_rating} onValueChange={(value) => handleInputChange('star_rating', value)}>
                <SelectTrigger className={`w-full ${fieldClass}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.0">3.0 ⭐⭐⭐</SelectItem>
                  <SelectItem value="3.5">3.5 ⭐⭐⭐</SelectItem>
                  <SelectItem value="4.0">4.0 ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="4.5">4.5 ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="5.0">5.0 ⭐⭐⭐⭐⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transport_type" className={labelClass}>Transport</Label>
              <Select value={formData.transport_type} onValueChange={(value) => handleInputChange('transport_type', value)}>
                <SelectTrigger className={`w-full ${fieldClass}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSPORT_OPTIONS.map(transport => (
                    <SelectItem key={transport} value={transport}>
                      {transport.charAt(0).toUpperCase() + transport.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accommodation_level" className={labelClass}>Accommodation</Label>
              <Select value={formData.accommodation_level} onValueChange={(value) => handleInputChange('accommodation_level', value)}>
                <SelectTrigger className={`w-full ${fieldClass}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMMODATION_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className={labelClass}>Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what makes this package special..."
              rows={3}
              className={fieldClass}
            />
          </div>

          <div>
            <Label htmlFor="image_url" className={labelClass}>Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://..."
              className={fieldClass}
            />
          </div>

          {/* Includes */}
          <div>
            <Label className={labelClass}>What's Included</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newInclude}
                onChange={(e) => setNewInclude(e.target.value)}
                placeholder="e.g., Airport transfers"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                className={fieldClass}
              />
              <Button type="button" variant="outline" onClick={addInclude}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.includes.map((include, index) => (
                <Badge key={index} variant="secondary">
                  {include}
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Available Dates */}
          <div>
            <Label className={labelClass}>Available Dates</Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className={fieldClass}
              />
              <Button type="button" variant="outline" onClick={addDate}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.available_dates.map((date, index) => (
                <Badge key={index} variant="secondary">
                  {new Date(date).toLocaleDateString()}
                  <button
                    type="button"
                    onClick={() => removeDate(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isSubmitting ? "Creating..." : "Create Package"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}