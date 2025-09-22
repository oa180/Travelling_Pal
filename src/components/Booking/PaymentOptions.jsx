
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Added this import
import { CreditCard } from "lucide-react";

// Inline SVG payment icons (reliable, no external requests)
const VisaIcon = () => (
  <svg viewBox="0 0 64 24" className="h-6" role="img" aria-label="Visa">
    <rect width="64" height="24" rx="4" fill="#1a1f2e" />
    <text x="32" y="16" textAnchor="middle" fontSize="12" fill="#1a73e8" fontWeight="700">VISA</text>
  </svg>
);
const MasterCardIcon = () => (
  <svg viewBox="0 0 64 24" className="h-6" role="img" aria-label="MasterCard">
    <rect width="64" height="24" rx="4" fill="#1a1f2e" />
    <circle cx="28" cy="12" r="6" fill="#ff5f00" />
    <circle cx="36" cy="12" r="6" fill="#eb001b" fillOpacity="0.85" />
  </svg>
);
const PayPalIcon = () => (
  <svg viewBox="0 0 64 24" className="h-6" role="img" aria-label="PayPal">
    <rect width="64" height="24" rx="4" fill="#1a1f2e" />
    <text x="32" y="16" textAnchor="middle" fontSize="11" fill="#3b82f6" fontWeight="700">PayPal</text>
  </svg>
);
const LocalWalletIcon = () => (
  <div className="h-6 w-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-md flex items-center justify-center text-white text-[10px] font-bold">
    WALLET
  </div>
);

const paymentMethods = [
  { id: "visa", name: "Visa", icon: <VisaIcon /> },
  { id: "mastercard", name: "MasterCard", icon: <MasterCardIcon /> },
  { id: "paypal", name: "PayPal", icon: <PayPalIcon /> },
  { id: "local_wallet", name: "Local Wallet", icon: <LocalWalletIcon /> },
];

export default function PaymentOptions({ selectedMethod, onSelectMethod }) {
  return (
    <Card className="bg-gray-900/40 border border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white/90">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={onSelectMethod}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <Label
                key={method.id}
                htmlFor={method.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all bg-gray-900/30 text-gray-200 ${
                  selectedMethod === method.id
                    ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.2)]'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} />
                  {method.icon}
                </div>
              </Label>
            ))}
          </div>
        </RadioGroup>
        <div className="mt-6 p-4 border rounded-lg border-gray-800 bg-gray-900/30">
          <p className="font-semibold text-white mb-2">
            Pay with Card (mockup)
          </p>
          <div className="space-y-4">
            <Input placeholder="Card Number" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="MM / YY" />
              <Input placeholder="CVC" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
