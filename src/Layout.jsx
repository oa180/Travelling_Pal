import React from "react";
import Header from "./components/layout/Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-1">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}