import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, DollarSign, Plane, Building, Star } from "lucide-react";

const FilterSection = ({ icon: Icon, title, children }) => (
  <div>
    <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-400">
      {Icon && <Icon className="w-4 h-4" />}
      {title}
    </Label>
    {children}
  </div>
);

export default function SearchFilters({ filters, setFilters, sortBy, setSortBy }) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-gray-800/30 border border-gray-700 rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FilterSection title="Sort by">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        <FilterSection icon={DollarSign} title="Budget Range">
          <Select value={filters.budget} onValueChange={(value) => handleFilterChange('budget', value)}>
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white"><SelectValue placeholder="Any budget" /></SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Any budget</SelectItem>
              <SelectItem value="0-500">Under $500</SelectItem>
              <SelectItem value="500-1000">$500 - $1,000</SelectItem>
              <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
              <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
              <SelectItem value="5000">Over $5,000</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        <FilterSection icon={Plane} title="Transport">
          <Select value={filters.transport} onValueChange={(value) => handleFilterChange('transport', value)}>
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white"><SelectValue placeholder="Any transport" /></SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Any transport</SelectItem>
              <SelectItem value="flight">Flight</SelectItem>
              <SelectItem value="bus">Bus</SelectItem>
              <SelectItem value="train">Train</SelectItem>
              <SelectItem value="car">Car</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        <FilterSection icon={Building} title="Accommodation">
          <Select value={filters.accommodation} onValueChange={(value) => handleFilterChange('accommodation', value)}>
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white"><SelectValue placeholder="Any level" /></SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Any level</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        <FilterSection icon={Star} title="Minimum Rating">
          <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white"><SelectValue placeholder="Any rating" /></SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Any rating</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
              <SelectItem value="5">5 stars only</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>
      </CardContent>
    </Card>
  );
}