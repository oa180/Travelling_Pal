import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plane, 
  MessageSquare, 
  Building, 
  Shield, 
  Search,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 text-gray-900 dark:text-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.5)] bg-white/90 border-b border-gray-200 dark:border-transparent dark:bg-gradient-to-r dark:from-sky-600 dark:via-fuchsia-600 dark:to-emerald-600">
      <div className="backdrop-blur bg-white/40 dark:bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
          <div className="flex items-center shrink-0">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200 bg-sky-600 dark:bg-sky-500">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold leading-none text-gray-900 dark:text-white">TravelChat</span>
                <span className="hidden sm:block text-xs -mt-0.5 text-gray-600 dark:text-gray-200/80">Plan & Book in Chat</span>
              </div>
            </Link>
          </div>
          <nav className="flex-1 min-w-0 hidden md:flex items-center gap-1 flex-nowrap overflow-x-auto no-scrollbar">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`relative group inline-flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                  isActivePage(item.url)
                    ? 'dark:text-white dark:bg-white/20 dark:ring-1 dark:ring-inset dark:ring-white/30 text-sky-700 bg-sky-50 ring-1 ring-inset ring-sky-100'
                    : 'dark:text-white/90 dark:hover:text-white dark:hover:bg-white/15 dark:ring-1 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 text-gray-700 hover:text-gray-900 hover:bg-gray-100 ring-1 ring-inset ring-gray-200 hover:ring-gray-300'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.title}</span>
                <span className={`pointer-events-none absolute -bottom-2 left-3 right-3 h-0.5 rounded-full transition-opacity duration-200 ${
                  isActivePage(item.url)
                    ? 'dark:bg-white/80 bg-sky-400 opacity-100'
                    : 'dark:bg-white/70 bg-sky-300 opacity-0 group-hover:opacity-100'
                }`} />
              </Link>
            ))}
          </nav>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg ring-1 ring-inset ring-gray-200 hover:bg-gray-100 text-gray-700"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          {/* Mobile auth controls */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="px-3 py-1.5 rounded-full text-sm ring-1 ring-inset transition-colors bg-gray-100 text-gray-800 ring-gray-300 hover:bg-gray-200 dark:bg-white/15 dark:text-white/90 dark:ring-white/20 dark:hover:bg-white/25">Log in</Link>
                <Link to="/signup" className="px-3 py-1.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 text-sm dark:bg-white dark:text-sky-700 dark:hover:bg-sky-50">Sign up</Link>
              </>
            ) : (
              <>
                <span className="px-3 py-1.5 rounded-full text-xs ring-1 ring-inset transition-colors bg-gray-100 text-gray-800 ring-gray-300 dark:bg-white/15 dark:text-white/90 dark:ring-white/20">
                  {user?.name || user?.email || 'Account'}
                </span>
                <button onClick={logout} className="px-3 py-1.5 rounded-full text-sm ring-1 ring-inset transition-colors bg-gray-100 text-gray-800 ring-gray-300 hover:bg-gray-200 dark:bg-white/15 dark:text-white/90 dark:ring-white/20 dark:hover:bg-white/25">Logout</button>
              </>
            )}
          </div>
          {/* Desktop auth controls */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 rounded-full text-sm ring-1 ring-inset transition-colors bg-gray-100 text-gray-800 ring-gray-300 hover:bg-gray-200 dark:bg-white/15 dark:text-white/90 dark:ring-white/20 dark:hover:bg-white/25">Log in</Link>
                <Link to="/signup" className="px-3 py-1.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 text-sm dark:bg-white dark:text-sky-700 dark:hover:bg-sky-50">Sign up</Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full text-xs ring-1 ring-inset transition-colors bg-gray-100 text-gray-800 ring-gray-300 dark:bg-white/15 dark:text-white/90 dark:ring-white/20">
                  {user?.name || user?.email || user?.mobile || 'Account'} {role ? `· ${role}` : ''}
                </span>
                <button onClick={() => { setMobileOpen(false); logout(); }} className="px-3 py-1.5 rounded-full text-sm ring-1 ring-inset transition-colors bg-gray-100 text-gray-800 ring-gray-300 hover:bg-gray-200">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setMobileOpen(false)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm ring-1 ring-inset ${
                    isActivePage(item.url)
                      ? 'text-sky-700 bg-sky-50 ring-sky-100'
                      : 'text-gray-700 bg-white ring-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 rounded-full text-sm ring-1 ring-inset transition-colors bg-gray-100 text-gray-800 ring-gray-300 hover:bg-gray-200">Log in</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 text-sm">Sign up</Link>
                </>
              ) : (
                <>
                  <span className="px-3 py-1.5 rounded-full text-xs ring-1 ring-inset transition-colors bg-gray-100 text-gray-800 ring-gray-300">
                    {user?.name || user?.email || 'Account'} {role ? `· ${role}` : ''}
                  </span>
                  <button onClick={() => { setMobileOpen(false); logout(); }} className="px-3 py-1.5 rounded-full text-sm ring-1 ring-inset transition-colors bg-gray-100 text-gray-800 ring-gray-300 hover:bg-gray-200">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </header>
  );
}
