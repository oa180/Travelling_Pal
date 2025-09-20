

import React, { useState } from "react";
import { TravelPackage } from "@/entities/TravelPackage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Star, MapPin, Calendar, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PackageManagement({ packages, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (packageId) => {
    try {
      setDeletingId(packageId);
      await TravelPackage.delete(packageId);
      onRefresh();
    } catch (error) {
      console.error("Error deleting package:", error);
    }
    setDeletingId(null);
  };

  const toggleStatus = async (pkg) => {
    try {
      await TravelPackage.update(pkg.id, { 
        is_active: !pkg.is_active 
      });
      onRefresh();
    } catch (error) {
      console.error("Error updating package status:", error);
    }
  };

  if (packages.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Eye className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No packages yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first travel package to start receiving bookings
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Travel Packages ({packages.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={pkg.image_url || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80&h=80&fit=crop`}
                      alt={pkg.destination}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {pkg.title}
                      </h3>
                      <Badge variant={pkg.is_active ? "default" : "secondary"}>
                        {pkg.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{pkg.destination}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{pkg.star_rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{pkg.duration_days} days</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Max {pkg.max_travelers}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-end lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${pkg.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(pkg)}
                    >
                      {pkg.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Package</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{pkg.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(pkg.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}