import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { role } = JSON.parse(sessionStorage.getItem("user") || "{}");
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Hide search bar and language when on login or signup page
  const hideSearch =
    location.pathname === "/login" || location.pathname === "/SignIN";

  // Sample notifications
  const notifications = [
    "Your order has been shipped ",
    "Seller will let you know soon ",
    "Payment received successfully ",
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-700 to-green-600 shadow-md">
      {/* Top Section */}
      {!hideSearch && (
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-white">
          {/* Language Dropdown */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-transform duration-300 hover:scale-105">
            <span className="font-semibold tracking-wide">🌐 Language</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="flex overflow-hidden rounded-full shadow-md border border-green-300 focus-within:ring-2 focus-within:ring-yellow-400 transition">
              <select className="w-[140px] bg-green-100 text-green-800 px-3 py-2 border-r border-green-300 outline-none">
                <option value="all">All Categories</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
              </select>
              <div className="flex-1 relative">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="w-full px-4 py-2 text-gray-800 focus:outline-none"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-yellow-400 hover:bg-yellow-500 text-black transition-all duration-300 hover:scale-105 active:scale-95 rounded-r-full">
                  <svg
                    className="h-5 w-5 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Login / Signup Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-white hover:bg-white hover:text-green-700 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              Login
            </Link>
            <Link
              to="/SignIN"
              className="px-4 py-2 rounded-full border border-yellow-300 bg-yellow-400 text-green-900 hover:bg-yellow-500 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="bg-white border-t border-green-100 shadow-inner">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-3 gap-8 text-gray-700 font-medium tracking-wide relative">
            {[
              { name: "Home", link: "/" },
              role === "seller"
                ? { name: "Seller Dashboard", link: "/seller" }
                : { name: "Shipping", link: "/shipping" },
              { name: "Services", link: "/services" },
              { name: "Deals", link: "/deals" },
              { name: "Cart", link: "/cart" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="relative hover:text-green-700 transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-green-100 transition"
              >
                <svg
                  className="h-6 w-6 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3c0 .386-.146.74-.405 1.01L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-1">
                  {notifications.length}
                </span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-64 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-2 font-semibold bg-green-100 border-b border-gray-200">
                    Notifications
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((note, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-green-50 border-b border-gray-100 text-sm"
                      >
                        {note}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
