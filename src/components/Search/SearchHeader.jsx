import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchHeader({ searchQuery, setSearchQuery }) {
  return (
    <div className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Travel Packages</h1>
            <p className="text-gray-400 mt-1">
              Discover amazing destinations and book your perfect trip
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search destinations, countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-offset-gray-900 focus:ring-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}