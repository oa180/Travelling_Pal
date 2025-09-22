import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Users } from "lucide-react";

export default function PackageCard({ package: pkg }) {
  return (
    <Card className="group bg-gray-800/30 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 overflow-hidden rounded-lg">
      <div className="relative">
        <Link to={createPageUrl(`/Package/${pkg.id}`)}>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={pkg.image_url || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop`}
              alt={pkg.destination}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
        <div className="absolute top-4 left-4">
          <Badge className="bg-gray-900/50 text-white backdrop-blur-sm border border-white/10">
            <Star className="w-3 h-3 mr-1.5 fill-current text-yellow-400" />
            {pkg.star_rating}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm text-gray-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {pkg.destination}
          </p>
          <Link to={createPageUrl(`/Package/${pkg.id}`)}>
            <h3 className="font-semibold text-lg text-white mt-1 group-hover:text-sky-400 transition-colors">
              {pkg.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{pkg.duration_days} days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Max {pkg.max_travelers}</span>
          </div>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-gray-700/50">
          <div>
            <p className="text-2xl font-bold text-white">
              ${pkg.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 -mt-1">per person</p>
          </div>
          
          <Link to={createPageUrl(`/Booking?package=${pkg.id}`)}>
            <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}