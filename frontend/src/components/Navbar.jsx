import React, { useState } from "react";

function Navbar() {
  const [activeLink, setActiveLink] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Cricket", path: "/cricket" },
    { name: "Match", path: "/match" },
    { name: "Ranking", path: "/ranking" },
    { name: "Live match", path: "/live-match" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full">
      {/* Top banner with tournament info - Hidden on mobile */}
      <div className="bg-gray-100 py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-center space-x-6 text-sm text-gray-700">
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">Men's Cricket World Cup 2023</span>
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">World Test Championship</span>
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">Women's T20 World Cup 2023</span>
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">U19 Women's T20 World Cup 2023</span>
        </div>
      </div>

      {/* Mobile Tournament Selector */}
      <div className="bg-gray-100 py-2 px-4 md:hidden">
        <div className="flex justify-center">
          <select className="bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            <option>Men's Cricket World Cup 2023</option>
            <option>World Test Championship</option>
            <option>Women's T20 World Cup 2023</option>
            <option>U19 Women's T20 World Cup 2023</option>
          </select>
        </div>
      </div>

      {/* Main navigation row */}
      <nav className="bg-white border-b border-gray-200 py-4 shadow-sm relative z-40">
        <div className="container mx-auto px-4">
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center">
            
            {/* Left Group: Logo */}
            <div className="flex items-center pr-12">
              <a href="/" className="flex items-center space-x-3">
                <img src="/icon.png" alt="Logo" className="w-10 h-10 ml-2" />

                <span className="text-2xl font-bold text-gray-800 font-serif">CRICKET</span>
              </a>
              
            </div>

            {/* Center Group: Navigation Links */}
            <div className="flex items-center justify-center space-x-1">
              {navigationLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLink(link.name)}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeLink === link.name
                      ? "bg-red-500 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Right Group: Social Icons */}
            <div className="flex items-center space-x-3 pl-12">
              <a 
                href="https://www.facebook.com      " 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.twitter.com      " 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sky-400 hover:bg-sky-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.instagram.com      " 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987C18.634 23.974 24 18.607 24 11.987 24 5.367 18.634.001 12.017.001zm5.576 16.641c0 1.458-1.186 2.642-2.644 2.642H9.053c-1.458 0-2.644-1.184-2.644-2.642V7.359c0-1.458 1.186-2.642 2.644-2.642h5.896c1.458 0 2.644 1.184 2.644 2.642v9.282z"/>
                  <circle cx="12" cy="12" r="3.5"/>
                  <circle cx="17.5" cy="6.5" r="1"/>
                </svg>
              </a>
              
              <a 
                href="https://telegram.org      " 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile Layout - FIXED */}
          <div className="flex lg:hidden items-center justify-between w-full">
            {/* Left: Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <img 
                  src="/ic.png" 
                  alt="Cricket Logo" 
                  className="w-8 h-8 rounded-full object-cover shadow-lg"
                />
                <span className="text-base font-bold text-gray-800 font-serif">
                  CRICKET
                </span>
              </a>
            </div>

            {/* Right Side: Social Icons + Hamburger */}
            <div className="flex items-center space-x-1.5">
              {/* Social Icons - visible on mobile */}
              <a 
                href="https://www.facebook.com      " 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.twitter.com      " 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-7 h-7 bg-sky-400 text-white rounded-full flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.instagram.com      " 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987C18.634 23.974 24 18.607 24 11.987 24 5.367 18.634.001 12.017.001zm5.576 16.641c0 1.458-1.186 2.642-2.644 2.642H9.053c-1.458 0-2.644-1.184-2.644-2.642V7.359c0-1.458 1.186-2.642 2.644-2.642h5.896c1.458 0 2.644 1.184 2.644 2.642v9.282z"/>
                  <circle cx="12" cy="12" r="3.5"/>
                  <circle cx="17.5" cy="6.5" r="1"/>
                </svg>
              </a>
              
              <a 
                href="https://telegram.org      " 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>

              {/* Hamburger Menu Button - Only visible on mobile */}
              <button
                onClick={toggleMobileMenu}
                className="ml-1.5 p-1.5 bg-white text-gray-700 hover:text-red-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Menu Dropdown - Added z-50 to ensure it appears above other elements */}
        <div className={`lg:hidden absolute top-full left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              {navigationLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveLink(link.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 ${
                    activeLink === link.name
                      ? "bg-red-500 text-white shadow-md"
                      : "text-gray-700 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;