import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home";
import SearchResults from "./Pages/Search Results";
import CompanyDashboard from "./Pages/CompanyDashboard";
import AdminPanel from "./Pages/AdminPanel";
import BookingPage from "./Pages/Booking";
import BookingConfirmation from "./Pages/BookingConfirmation";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/SearchResults" element={<SearchResults />} />
          <Route path="/CompanyDashboard" element={<CompanyDashboard />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />
          <Route path="/Booking" element={<BookingPage />} />
          <Route
            path="/BookingConfirmation"
            element={<BookingConfirmation />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
