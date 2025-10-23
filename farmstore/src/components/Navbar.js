import React from 'react'
import { Link } from 'react-router-dom';

export default function Navbar() {
    const { role } = JSON.parse(sessionStorage.getItem('user') || '{}');

    return (
        <header className="sticky top-0 z-50 shadow-md bg-white">
            {/* Top Bar */}
            <div className="bg-green-700 text-white">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                    {/* Language Selector */}
                    <div className="flex items-center gap-2 cursor-pointer hover:text-green-200 transition">
                        <span className="font-medium">Language</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-8">
                        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-300">
                            <select className="w-[150px] bg-white text-black px-3 py-2 border-r border-gray-300">
                                <option value="all">All Categories</option>
                                <option value="fruits">Fruits</option>
                                <option value="vegetables">Vegetables</option>
                            </select>
                            <div className="flex-1 relative">
                                <input
                                    type="search"
                                    placeholder="Search Product"
                                    className="w-full px-4 py-2 focus:outline-none text-black"
                                />
                                <button className="absolute right-0 top-0 h-full px-4 bg-green-600 hover:bg-green-500 text-white transition">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Login/Registration */}
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-3 py-1 rounded-lg hover:bg-white hover:text-green-700 transition border border-white">Login</Link>
                         <Link to="/SignIN" className="px-3 py-1 rounded-lg hover:bg-white hover:text-green-700 transition border border-white">Signup</Link>
                        {/* Add registration if needed */}
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="bg-white border-b">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center py-4 gap-10 text-gray-700 font-medium">
                        <Link to="/" className="hover:text-green-700 transition">Home</Link>
                        {role === 'seller' ? (
                            <Link to="/seller" className="hover:text-green-700 transition">Seller Dashboard</Link>
                        ) : (
                            <Link to="/shipping" className="hover:text-green-700 transition">Shipping</Link>
                        )}
                        <Link to="/services" className="hover:text-green-700 transition">Services</Link>
                        <Link to="/deals" className="hover:text-green-700 transition">Deals</Link>
                        <Link to="/cart" className="hover:text-green-700 transition">Cart</Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}
