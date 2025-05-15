import React from "react";

const Footer = () => (
  <footer className="w-full bg-[#181818] text-gray-400 border-t border-gray-800 relative">
    <div className="max-w-7xl mx-auto px-8 py-8 flex flex-wrap justify-between">
      <div className="mb-6">
        <div className="mb-2 flex gap-4">
          <a href="#" className="hover:underline">Legal</a>
          <a href="#" className="hover:underline">Safety & Privacy Center</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookies</a>
        </div>
        <div className="mb-2 flex gap-4">
          <a href="#" className="hover:underline">About Ads</a>
          <a href="#" className="hover:underline">Accessibility</a>
        </div>
        <button className="border border-gray-600 rounded-full px-3 py-1 flex items-center gap-2 mt-2">
          <span className="material-icons text-base">language</span> English
        </button>
      </div>
      <div className="mb-6">
        <h4 className="font-bold text-white mb-2">Company</h4>
        <ul className="space-y-1">
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Jobs</a></li>
          <li><a href="#" className="hover:underline">For the Record</a></li>
        </ul>
      </div>
      <div className="mb-6">
        <h4 className="font-bold text-white mb-2">Communities</h4>
        <ul className="space-y-1">
          <li><a href="#" className="hover:underline">For Artists</a></li>
          <li><a href="#" className="hover:underline">Developers</a></li>
          <li><a href="#" className="hover:underline">Advertising</a></li>
          <li><a href="#" className="hover:underline">Investors</a></li>
          <li><a href="#" className="hover:underline">Vendors</a></li>
        </ul>
      </div>
      <div className="mb-6">
        <h4 className="font-bold text-white mb-2">Useful links</h4>
        <ul className="space-y-1">
          <li><a href="#" className="hover:underline">Support</a></li>
          <li><a href="#" className="hover:underline">Free Mobile App</a></li>
        </ul>
      </div>
      <div className="mb-6">
        <h4 className="font-bold text-white mb-2">Spotify Plans</h4>
        <ul className="space-y-1">
          <li><a href="#" className="hover:underline">Premium Individual</a></li>
          <li><a href="#" className="hover:underline">Premium Duo</a></li>
          <li><a href="#" className="hover:underline">Premium Family</a></li>
          <li><a href="#" className="hover:underline">Premium Student</a></li>
          <li><a href="#" className="hover:underline">Spotify Free</a></li>
        </ul>
      </div>
    </div>
    {/* Preview Bar */}
    <div className="w-full absolute left-0 bottom-0 bg-gradient-to-r from-purple-700 via-purple-500 to-blue-400 flex items-center justify-between px-8 py-4">
      <div className="text-white font-semibold">
        Preview of Spotify<br />
        <span className="text-sm font-normal">Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.</span>
      </div>
      <button className="bg-white text-black font-bold px-8 py-2 rounded-full text-lg shadow hover:scale-105 transition-transform">Sign up free</button>
    </div>
  </footer>
);

export default Footer; 