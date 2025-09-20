
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Added this import
import { CreditCard } from "lucide-react";

// Mock payment icons
const VisaIcon = () => <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c257bbf0831a29b05701a54b395b1.svg" alt="Visa" className="h-6" />;
const MasterCardIcon = () => <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8307445c083626a5f543f443b0060f.svg" alt="MasterCard" className="h-6" />;
const PayPalIcon = () => <img src="https://www.paypalobjects.com/images/shared/developer/logo/PP_Acceptance_Marks_for_LogoCenter_266x142.png" alt="PayPal" className="h-8" />;
const LocalWalletIcon = () => <div className="h-6 w-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-md flex items-center justify-center text-white text-xs font-bold">WALLET</div>;

const paymentMethods = [
  { id: "visa", name: "Visa", icon: <VisaIcon /> },
  { id: "mastercard", name: "MasterCard", icon: <MasterCardIcon /> },
  { id: "paypal", name: "PayPal", icon: <PayPalIcon /> },
  { id: "local_wallet", name: "Local Wallet", icon: <LocalWalletIcon /> },
];

export default function PaymentOptions({ selectedMethod, onSelectMethod }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={onSelectMethod}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethods.map(method => (
              <Label
                key={method.id}
                htmlFor={method.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'
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
        <div className="mt-6 p-4 border rounded-lg">
          <p className="font-semibold text-gray-900 mb-2">
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
