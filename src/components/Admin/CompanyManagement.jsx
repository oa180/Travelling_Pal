

import React, { useState } from "react";
import { Company } from "@/entities/Company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Phone, 
  Globe,
  Package,
  DollarSign,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function CompanyManagement({ companies, packages, bookings, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  const getCompanyStats = (companyId, createdBy) => {
    const companyPackages = packages.filter(pkg => 
      pkg.provider_id === companyId || pkg.created_by === createdBy
    );
    const companyBookings = bookings.filter(booking => 
      companyPackages.some(pkg => pkg.id === booking.package_id)
    );
    const revenue = companyBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

    return {
      packages: companyPackages.length,
      bookings: companyBookings.length,
      revenue
    };
  };

  const handleVerifyCompany = async (companyId, currentStatus) => {
    setProcessingId(companyId);
    try {
      await Company.update(companyId, { is_verified: !currentStatus });
      onRefresh();
    } catch (error) {
      console.error("Error updating company verification:", error);
    }
    setProcessingId(null);
  };

  const handleToggleStatus = async (companyId, currentStatus) => {
    setProcessingId(companyId);
    try {
      await Company.update(companyId, { is_active: !currentStatus });
      onRefresh();
    } catch (error) {
      console.error("Error updating company status:", error);
    }
    setProcessingId(null);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = !searchQuery || 
      company.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.contact_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "verified" && company.is_verified) ||
      (statusFilter === "unverified" && !company.is_verified) ||
      (statusFilter === "active" && company.is_active) ||
      (statusFilter === "inactive" && !company.is_active);
    
    const matchesType = typeFilter === "all" || company.company_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Management ({filteredCompanies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="travel_agency">Travel Agencies</SelectItem>
                <SelectItem value="hotel">Hotels</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="tour_operator">Tour Operators</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredCompanies.map((company) => {
            const stats = getCompanyStats(company.id, company.created_by);
            return (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {company.logo_url ? (
                          <img
                            src={company.logo_url}
                            alt="Company Logo"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {company.company_name}
                          </h3>
                          <div className="flex gap-2">
                            <Badge variant={company.is_active ? "default" : "secondary"}>
                              {company.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant={company.is_verified ? "default" : "outline"}>
                              {company.is_verified ? "Verified" : "Unverified"}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {company.company_type?.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{company.contact_email}</span>
                          </div>
                          {company.contact_phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{company.contact_phone}</span>
                            </div>
                          )}
                          {company.website && (
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4" />
                              <span className="truncate">{company.website}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <Package className="w-4 h-4 text-blue-500" />
                            <span>{stats.packages} packages</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span>{stats.bookings} bookings</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">${stats.revenue.toLocaleString()} revenue</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button
                        variant={company.is_verified ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleVerifyCompany(company.id, company.is_verified)}
                        disabled={processingId === company.id}
                        className="flex items-center gap-2"
                      >
                        {company.is_verified ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            Unverify
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Verify
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(company.id, company.is_active)}
                        disabled={processingId === company.id}
                      >
                        {company.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}