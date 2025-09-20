
import React, { useState, useEffect, useCallback } from "react";
import { TravelPackage } from "@/entities/TravelPackage";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

import SearchFilters from "../components/search/SearchFilters";
import PackageCard from "../components/search/PackageCard";

export default function SearchResults() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    budget: "all",
    transport: "all",
    accommodation: "all",
    rating: "all"
  });
  const [sortBy, setSortBy] = useState("price_low");

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      // To test with data, you can use TravelPackage.list()
      const data = await TravelPackage.list();
      setPackages(data);
    } catch (error) {
      console.error("Error loading packages:", error);
    }
    setIsLoading(false);
  };

  const applyFilters = useCallback(() => {
    let filtered = [...packages];

    if (searchQuery) {
      filtered = filtered.filter(pkg =>
        pkg.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.country?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.budget !== "all") {
      const [min, max] = filters.budget.split("-").map(Number);
      filtered = filtered.filter(pkg => max ? pkg.price >= min && pkg.price <= max : pkg.price >= min);
    }

    if (filters.transport !== "all") {
      filtered = filtered.filter(pkg => pkg.transport_type === filters.transport);
    }

    if (filters.accommodation !== "all") {
      filtered = filtered.filter(pkg => pkg.accommodation_level === filters.accommodation);
    }

    if (filters.rating !== "all") {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(pkg => pkg.star_rating >= minRating);
    }

    switch (sortBy) {
      case "price_low": filtered.sort((a, b) => a.price - b.price); break;
      case "price_high": filtered.sort((a, b) => b.price - a.price); break;
      case "rating": filtered.sort((a, b) => b.star_rating - a.star_rating); break;
      case "duration": filtered.sort((a, b) => a.duration_days - b.duration_days); break;
      default: break;
    }

    setFilteredPackages(filtered);
  }, [packages, filters, searchQuery, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setFilters({
      budget: "all",
      transport: "all",
      accommodation: "all",
      rating: "all"
    });
    setSearchQuery("");
    setSortBy("price_low");
  };

  return (
    <div className="dark bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Search Results</h1>
          <p className="text-gray-400 mt-1">Find the perfect travel package for your next adventure.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 xl:w-1/5 space-y-8 self-start sticky top-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Search by keyword</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="e.g. Paris, beach..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-offset-gray-900 focus:ring-white"
                />
              </div>
            </div>
            <SearchFilters 
              filters={filters}
              setFilters={setFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          <div className="flex-1">
            {!isLoading && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {filteredPackages.length} {filteredPackages.length === 1 ? 'package' : 'packages'} found
              </h2>
            </div>
            )}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden">
                    <div className="h-48 bg-gray-700 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-700 animate-pulse rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 animate-pulse rounded w-1/2"></div>
                      <div className="flex items-end justify-between pt-3 border-t border-transparent">
                        <div className="w-1/2 space-y-2">
                           <div className="h-6 bg-gray-700 animate-pulse rounded w-2/3"></div>
                           <div className="h-3 bg-gray-700 animate-pulse rounded w-1/3"></div>
                        </div>
                        <div className="h-8 bg-gray-700 animate-pulse rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-gray-800/20 border-2 border-dashed border-gray-700 rounded-lg">
                <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6 ring-8 ring-gray-800/30">
                  <Search className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 mt-4">
                  No packages found
                </h3>
                <p className="text-gray-400 mb-6 max-w-xs">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline" className="bg-transparent border-sky-500 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <AnimatePresence>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PackageCard package={pkg} />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
