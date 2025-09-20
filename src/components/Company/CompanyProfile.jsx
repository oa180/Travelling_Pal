

import React, { useState } from "react";
import { Company } from "@/entities/Company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Building, Mail, Phone, Globe, MapPin, Save } from "lucide-react";

const COMPANY_TYPES = [
  { value: "travel_agency", label: "Travel Agency" },
  { value: "hotel", label: "Hotel" },
  { value: "transport", label: "Transport Provider" },
  { value: "tour_operator", label: "Tour Operator" }
];

export default function CompanyProfile({ company, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: company?.company_name || "",
    company_type: company?.company_type || "travel_agency",
    contact_email: company?.contact_email || "",
    contact_phone: company?.contact_phone || "",
    address: company?.address || "",
    website: company?.website || "",
    description: company?.description || "",
    logo_url: company?.logo_url || ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (company?.id) {
        await Company.update(company.id, formData);
      } else {
        await Company.create(formData);
      }
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error saving company profile:", error);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      company_name: company?.company_name || "",
      company_type: company?.company_type || "travel_agency",
      contact_email: company?.contact_email || "",
      contact_phone: company?.contact_phone || "",
      address: company?.address || "",
      website: company?.website || "",
      description: company?.description || "",
      logo_url: company?.logo_url || ""
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Profile
          </span>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                {company?.logo_url ? (
                  <img 
                    src={company.logo_url} 
                    alt="Company Logo" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Building className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {company?.company_name || "Company Name"}
                </h3>
                <p className="text-gray-600 capitalize">
                  {COMPANY_TYPES.find(t => t.value === company?.company_type)?.label || "Travel Agency"}
                </p>
                {company?.is_verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    ✓ Verified Partner
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{company?.contact_email || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{company?.contact_phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-medium">{company?.website || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{company?.address || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {company?.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">About Us</h4>
                <p className="text-gray-600 leading-relaxed">{company.description}</p>
              </div>
            )}
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <Label htmlFor="company_type">Company Type</Label>
                <Select value={formData.company_type} onValueChange={(value) => handleInputChange('company_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="contact@yourcompany.com"
                />
              </div>

              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Business St, City, State, Country"
              />
            </div>

            <div>
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell customers about your company, services, and what makes you special..."
                rows={4}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}