import React from "react";
import Header from "./components/layout/Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      <Header />
      <main className="flex-1">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}