import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TravelPackage } from "@/entities/TravelPackage";
import { ArrowLeft, Star, MapPin, Clock, Users, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PackageDetails() {
  const formatYMD = (val) => {
    try {
      if (!val) return "";
      if (typeof val === "string" && val.includes("T")) return val.split("T")[0];
      const d = new Date(val);
      if (!isNaN(d)) return d.toISOString().slice(0, 10);
      return String(val);
    } catch {
      return String(val);
    }
  };
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      setIsLoading(true);
      try {
        const found = await TravelPackage.get(id);
        setPkg(found || null);
      } catch (err) {
        console.error("Error loading package:", err);
        setPkg(null);
      }
      setIsLoading(false);
    };
    fetchPackage();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-800 rounded w-1/4"></div>
            <div className="h-96 bg-gray-800 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-40 bg-gray-800 rounded"></div>
                <div className="h-40 bg-gray-800 rounded"></div>
              </div>
              <div className="h-72 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Package Not Found</h2>
          <p className="text-gray-400 mb-6">The travel package you are looking for does not exist or has been removed.</p>
          <Link to={createPageUrl("SearchResults")}>
            <Button className="bg-sky-500 hover:bg-sky-600">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to={createPageUrl("/SearchResults")}
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search Results
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-lg overflow-hidden border border-gray-700">
              <img
                src={
                  pkg.image_url ||
                  `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop`
                }
                alt={pkg.destination}
                className="w-full h-[360px] md:h-[440px] object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-gray-900/60 text-white backdrop-blur-sm border border-white/10">
                  <Star className="w-3 h-3 mr-1.5 fill-current text-yellow-400" />
                  {pkg.star_rating}
                </Badge>
              </div>
            </div>

            <Card className="bg-gray-800/30 border border-gray-700/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {pkg.destination}
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold mt-1">{pkg.title}</h1>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration_days} days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>Max {pkg.max_travelers}</span>
                    </div>
                  </div>
                </div>

                {pkg.description && (
                  <p className="text-gray-300 leading-relaxed">{pkg.description}</p>
                )}

                {Array.isArray(pkg.includes) && pkg.includes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">What's included</h3>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(pkg.available_dates) && pkg.available_dates.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Available dates</h3>
                    <div className="flex flex-wrap gap-2">
                      {pkg.available_dates.slice(0, 8).map((d) => (
                        <span key={d} className="px-3 py-1 rounded-full border border-gray-700 text-gray-300">
                          {formatYMD(d)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-24 bg-gray-800/30 border border-gray-700/50">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-3xl font-bold">${(pkg.price || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-400 -mt-1">per person</p>
                </div>
                <div className="text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{pkg.provider_name || "Unknown provider"}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link to={createPageUrl(`/Booking?package=${pkg.id}`)}>
                    <Button className="w-full bg-sky-500 hover:bg-sky-600">Book Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
