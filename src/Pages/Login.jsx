import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Enforce exactly one identifier (email OR mobile)
    const hasEmail = !!email.trim();
    const hasMobile = !!mobile.trim();
    if (!hasEmail && !hasMobile) {
      setError("Please enter your email OR mobile number.");
      return;
    }
    if (hasEmail && hasMobile) {
      setError("Please provide only one: email OR mobile (not both).");
      return;
    }
    // Basic format validation
    const emailRegex = /.+@.+\..+/;
    const phoneRegex = /^[+]?\d[\d\s-]{6,}$/;
    if (hasEmail && !emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (hasMobile && !phoneRegex.test(mobile.trim())) {
      setError("Please enter a valid mobile number.");
      return;
    }
    try {
      const me = await login({ email: email || undefined, mobile: mobile || undefined, password, remember });
      // Role-based default landing when there is no prior protected page to return to
      const role = me?.role;
      const defaultLanding = role === 'ADMIN' ? '/AdminPanel' : role === 'COMPANY' ? '/CompanyDashboard' : '/';
      let target = from;
      // Protect the redirect: if from is role-protected and user lacks role, fallback
      if (from === '/AdminPanel' && role !== 'ADMIN') target = defaultLanding;
      if (from === '/CompanyDashboard' && role !== 'COMPANY') target = defaultLanding;
      if (!from || from === '/login' || from === '/signup') target = defaultLanding;
      navigate(target, { replace: true });
    } catch (err) {
      // Show API error message if provided
      const apiMsg = err?.body?.message || err?.message;
      setError(apiMsg || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <Card className="shadow-xl border-gray-200/70">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-gray-500">Log in with your email or mobile number</p>
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
                <Input className="pl-9 pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="rounded" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-600">Forgot password?</Link>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">Log in</Button>
            <p className="text-xs text-gray-500">By logging in, you agree to our Terms and Privacy Policy.</p>
          </form>

          <p className="text-sm text-gray-600">Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}
