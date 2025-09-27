import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, ROLE } from "@/contexts/AuthContext";
import { Mail, Phone, Lock, UserCog } from "lucide-react";

export default function Signup() {
  const { signup, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLE.TRAVELER);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() && !mobile.trim()) {
      setError("Please enter email or mobile number.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password.");
      return;
    }
    try {
      await signup({ email: email || undefined, mobile: mobile || undefined, password, role });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <Card className="shadow-xl border-gray-200/70">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-sm text-gray-500">Sign up with your email or mobile number</p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-600">Email (leave empty if using mobile)</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>

            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative inline-block bg-white px-2 text-xs text-gray-500">or</div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">Mobile (leave empty if using email)</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+1234567890" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">Role</label>
              <div className="relative">
                <UserCog className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full border rounded px-3 py-2 text-sm bg-white pl-9"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value={ROLE.TRAVELER}>Traveler</option>
                  <option value={ROLE.COMPANY}>Company</option>
                  <option value={ROLE.ADMIN}>Admin</option>
                </select>
              </div>
              <p className="text-xs text-gray-500">Choose the role to unlock the relevant features.</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">Create account</Button>
            <p className="text-xs text-gray-500">By signing up, you agree to our Terms and Privacy Policy.</p>
          </form>

          <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-600">Log in</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}
