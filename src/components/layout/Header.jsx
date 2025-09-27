import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plane, 
  MessageSquare, 
  Building, 
  Shield, 
  Search
} from "lucide-react";
import { useAuth, ROLE } from "@/contexts/AuthContext";

function buildNav(role) {
  const base = [
    { title: "Chat & Search", url: createPageUrl("Home"), icon: MessageSquare },
    { title: "Search Results", url: createPageUrl("SearchResults"), icon: Search },
  ];
  if (role === ROLE.COMPANY) base.push({ title: "Company Dashboard", url: createPageUrl("CompanyDashboard"), icon: Building });
  if (role === ROLE.ADMIN) base.push({ title: "Admin Panel", url: createPageUrl("AdminPanel"), icon: Shield });
  return base;
}

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, role, user, logout } = useAuth();
  const isActivePage = (url) => location.pathname === url;
  const navigationItems = useMemo(() => buildNav(role), [role]);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-sky-600 via-fuchsia-600 to-emerald-600 text-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.5)]">
      <div className="backdrop-blur bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
          <div className="flex items-center shrink-0">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-white leading-none">TravelChat</span>
                <span className="hidden sm:block text-xs text-gray-200/80 -mt-0.5">Plan & Book in Chat</span>
              </div>
            </Link>
          </div>
          <nav className="flex-1 min-w-0 flex items-center gap-1 flex-nowrap overflow-x-auto no-scrollbar">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`relative group inline-flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                  isActivePage(item.url)
                    ? 'text-white bg-white/20 ring-1 ring-inset ring-white/30 shadow-inner'
                    : 'text-white/90 hover:text-white hover:bg-white/15 ring-1 ring-inset ring-white/10 hover:ring-white/20'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.title}</span>
                <span className={`pointer-events-none absolute -bottom-2 left-3 right-3 h-0.5 rounded-full transition-opacity duration-200 ${
                  isActivePage(item.url) ? 'bg-white/80 opacity-100' : 'bg-white/70 opacity-0 group-hover:opacity-100'
                }`} />
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 rounded-full bg-white/15 ring-1 ring-inset ring-white/20 text-white/90 hover:bg-white/25 text-sm">Log in</Link>
                <Link to="/signup" className="px-3 py-1.5 rounded-full bg-white text-sky-700 hover:bg-sky-50 text-sm">Sign up</Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-white/15 ring-1 ring-inset ring-white/20 text-white/90 text-xs">
                  {user?.name || user?.email || user?.mobile || 'Account'} {role ? `· ${role}` : ''}
                </span>
                <button onClick={logout} className="px-3 py-1.5 rounded-full bg-white/15 ring-1 ring-inset ring-white/20 text-white/90 hover:bg-white/25 text-sm">Logout</button>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </header>
  );
}
