
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
      // Convert string numbers to actual numbers
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        duration_days: parseInt(formData.duration_days),
        star_rating: parseFloat(formData.star_rating),
        max_travelers: parseInt(formData.max_travelers),
        is_active: true
      };

      await onSubmit(packageData);
      
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
          <DialogTitle className="text-xl sm:text-2xl font-bold">Add New Travel Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="col-span-2">
              <Label htmlFor="title">Package Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Bali Paradise Getaway"
                required
              />
            </div>

            <div>
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder="e.g., Bali, Indonesia"
                required
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="e.g., Indonesia"
              />
            </div>

            <div>
              <Label htmlFor="continent">Continent</Label>
              <Select value={formData.continent} onValueChange={(value) => handleInputChange('continent', value)}>
                <SelectTrigger className="w-full">
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
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="999"
                required
              />
            </div>

            <div>
              <Label htmlFor="original_price">Original Price (optional)</Label>
              <Input
                id="original_price"
                type="number"
                value={formData.original_price}
                onChange={(e) => handleInputChange('original_price', e.target.value)}
                placeholder="1299"
              />
            </div>

            <div>
              <Label htmlFor="duration_days">Duration (days) *</Label>
              <Input
                id="duration_days"
                type="number"
                value={formData.duration_days}
                onChange={(e) => handleInputChange('duration_days', e.target.value)}
                placeholder="7"
                required
              />
            </div>

            <div>
              <Label htmlFor="max_travelers">Max Travelers</Label>
              <Input
                id="max_travelers"
                type="number"
                value={formData.max_travelers}
                onChange={(e) => handleInputChange('max_travelers', e.target.value)}
                placeholder="4"
              />
            </div>

            <div>
              <Label htmlFor="star_rating">Rating</Label>
              <Select value={formData.star_rating} onValueChange={(value) => handleInputChange('star_rating', value)}>
                <SelectTrigger className="w-full">
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
              <Label htmlFor="transport_type">Transport</Label>
              <Select value={formData.transport_type} onValueChange={(value) => handleInputChange('transport_type', value)}>
                <SelectTrigger className="w-full">
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
              <Label htmlFor="accommodation_level">Accommodation</Label>
              <Select value={formData.accommodation_level} onValueChange={(value) => handleInputChange('accommodation_level', value)}>
                <SelectTrigger className="w-full">
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what makes this package special..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Includes */}
          <div>
            <Label>What's Included</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newInclude}
                onChange={(e) => setNewInclude(e.target.value)}
                placeholder="e.g., Airport transfers"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
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
            <Label>Available Dates</Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
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