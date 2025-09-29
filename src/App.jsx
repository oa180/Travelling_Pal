import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home";
import SearchResults from "./Pages/SearchResults";
import CompanyDashboard from "./Pages/CompanyDashboard";
import AdminPanel from "./Pages/AdminPanel";
import BookingPage from "./Pages/Booking";
import BookingConfirmation from "./Pages/BookingConfirmation";
import PackageDetails from "./Pages/PackageDetails";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import RoleGuard from "@/components/auth/RoleGuard";
import { AuthProvider, ROLE } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/toast";
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/SearchResults" element={<SearchResults />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/CompanyDashboard"
                  element={
                    <RoleGuard allow={[ROLE.COMPANY]}>
                      <CompanyDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/AdminPanel"
                  element={
                    <RoleGuard allow={[ROLE.ADMIN]}>
                      <AdminPanel />
                    </RoleGuard>
                  }
                />
                <Route path="/Booking" element={<BookingPage />} />
                <Route path="/BookingConfirmation" element={<BookingConfirmation />} />
                <Route path="/Package/:id" element={<PackageDetails />} />
              </Routes>
            </Layout>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;
