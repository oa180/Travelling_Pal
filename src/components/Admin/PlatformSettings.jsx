

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save,
  AlertTriangle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function PlatformSettings() {
  const [settings, setSettings] = useState({
    platformName: "TravelChat",
    supportEmail: "support@travelchat.com",
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    autoVerifyCompanies: false,
    commissionRate: "5",
    maxPackagesPerCompany: "100",
    platformDescription: "The future of travel planning - powered by conversation"
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-6 h-6" />
            Platform Settings
          </h2>
          <p className="text-gray-600 mt-1">Configure platform-wide settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => handleSettingChange('platformName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="platformDescription">Platform Description</Label>
              <Textarea
                id="platformDescription"
                value={settings.platformDescription}
                onChange={(e) => handleSettingChange('platformDescription', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                value={settings.commissionRate}
                onChange={(e) => handleSettingChange('commissionRate', e.target.value)}
                min="0"
                max="50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-gray-500">Temporarily disable the platform</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>New Registrations</Label>
                <p className="text-sm text-gray-500">Allow new user registrations</p>
              </div>
              <Switch
                checked={settings.newRegistrations}
                onCheckedChange={(checked) => handleSettingChange('newRegistrations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Verify Companies</Label>
                <p className="text-sm text-gray-500">Automatically verify new company registrations</p>
              </div>
              <Switch
                checked={settings.autoVerifyCompanies}
                onCheckedChange={(checked) => handleSettingChange('autoVerifyCompanies', checked)}
              />
            </div>

            <div>
              <Label htmlFor="maxPackages">Max Packages per Company</Label>
              <Input
                id="maxPackages"
                type="number"
                value={settings.maxPackagesPerCompany}
                onChange={(e) => handleSettingChange('maxPackagesPerCompany', e.target.value)}
                min="1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Send platform notifications via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Notification Types</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">New Company Registrations</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">New Bookings</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">Payment Issues</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Database</span>
                  <Badge className="bg-green-500">Healthy</Badge>
                </div>
                <p className="text-xs text-green-600 mt-1">Response time: 45ms</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">API</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <p className="text-xs text-green-600 mt-1">Uptime: 99.9%</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">Storage</span>
                  <Badge className="bg-yellow-500">75% Used</Badge>
                </div>
                <p className="text-xs text-yellow-600 mt-1">2.1GB / 2.8GB</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Cache</span>
                  <Badge className="bg-blue-500">Active</Badge>
                </div>
                <p className="text-xs text-blue-600 mt-1">Hit ratio: 94%</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Scheduled Maintenance</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    System maintenance is scheduled for Sunday, 2:00 AM - 4:00 AM UTC.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}