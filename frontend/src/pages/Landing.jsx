import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Truck, ShieldCheck, ArrowRight, Leaf, HeartHandshake } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Sprout className="w-8 h-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">FarmConnect</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2.5 text-green-700 font-semibold hover:bg-green-50 rounded-full transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-white pt-16 md:pt-24 pb-32">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-50 opacity-50 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-50 opacity-50 blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-8 animate-fade-in-up">
              <Leaf className="w-4 h-4" /> 
              Fresh. Local. Direct.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
              From the Farm <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                Directly to Your Table.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Empowering local farmers and bringing the freshest organic produce straight to your doorstep. No middlemen. Just real food.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register" className="group px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-full shadow-xl shadow-green-200 hover:bg-green-700 hover:shadow-2xl hover:shadow-green-300 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                Shop Fresh Produce
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 text-lg font-bold rounded-full hover:border-green-600 hover:text-green-700 transition-all flex items-center justify-center">
                Become a Seller
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why choose FarmConnect?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">We are building a transparent, sustainable ecosystem that benefits both the consumer and the farmer.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  By cutting out the middlemen, you ensure that 100% of the profits go directly to the farmers who grow your food.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  All farmers are strictly vetted by our administrative team to guarantee the highest quality and organic standards.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive your fresh produce faster than ever. From harvest to your doorstep in the shortest time possible.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-green-500" />
            <span className="text-xl font-bold tracking-tight">FarmConnect</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FarmConnect. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
