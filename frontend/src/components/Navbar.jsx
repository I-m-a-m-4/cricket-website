import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSublink, setOpenSublink] = useState(null);
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const isLiveMatch = location.pathname.includes("live-scores");

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Live Scores", path: "/live-scores" },
    { name: "Fixtures & Results", path: "/fixtures-results" },
    {
      name: "Series",
      path: "/series",
      sublinks: [
        { name: "CPL 2025", path: "/series/cpl-2025" },
        { name: "Asia Cup", path: "/series/asia-cup" },
        { name: "AUS-A Women vs IND-A Women", path: "/series/aus-a-women-vs-ind-a-women" },
        { name: "Australia vs South Africa", path: "/series/australia-vs-south-africa" },
        { name: "UAE Tri-Series [UAE, AFG, PAK]", path: "/series/uae-tri-series" },
        { name: "Bangladesh vs Netherlands", path: "/series/bangladesh-vs-netherlands" },
        { name: "South Africa A vs New Zealand A", path: "/series/sa-a-vs-nz-a" },
        { name: "The Hundred (Women)", path: "/series/the-hundred-women" },
        { name: "The Hundred (Men)", path: "/series/the-hundred-men" },
        { name: "SLC T20 League", path: "/series/slc-t20-league" },
        { name: "Top End T20 Series", path: "/series/top-end-t20" },
        { name: "Vitality Blast Men", path: "/series/vitality-blast-men" },
        { name: "Vitality Blast Women", path: "/series/vitality-blast-women" },
        { name: "County Div1", path: "/series/county-div1" },
        { name: "County Div2", path: "/series/county-div2" },
        { name: "One-Day Cup (ENG)", path: "/series/one-day-cup-eng" },
        { name: "GAK 1-Day Tournament [AFG]", path: "/series/gak-1-day-afg" },
        { name: "Duleep Trophy", path: "/series/duleep-trophy" },
        { name: "Test Championship 2025-2027", path: "/series/test-championship" },
        { name: "Women's Championship", path: "/series/womens-championship" },
        { name: "World Cup League 2", path: "/series/world-cup-league-2" },
        { name: "CWC Challenge League Group A", path: "/series/cwc-challenge-a" },
        { name: "CWC Challenge League Group B", path: "/series/cwc-challenge-b" },
        { name: "Future Series", path: "/series/future-series" },
        { name: "Matches", path: "/series/matches" },
        { name: "Standings", path: "/series/standings" },
        { name: "Points Table", path: "/series/points-table" },
        { name: "News Tab", path: "/series/news-tab" },
      ],
    },
 
    { name: "Teams & Players", path: "/teams-players" },
    { name: "News & Highlights", path: "/news-highlights" },
    { name: "Stadiums", path: "/stadiums" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenSublink(null);
    setIsSocialDropdownOpen(false); // Close social dropdown when toggling mobile menu
  };

  const toggleSublink = (name) => {
    setOpenSublink(openSublink === name ? null : name);
  };

  const toggleSocialDropdown = () => {
    setIsSocialDropdownOpen(!isSocialDropdownOpen);
  };

  return (
    <header className="w-full">
      {/* Top banner with tournament info - Hidden on mobile */}
      <div className="bg-white py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-center space-x-4 text-xs text-gray-700">
          <span className="bg-white px-2 py-1 rounded-full shadow-sm">India tour of England 2025</span>
          <span className="bg-white px-2 py-1 rounded-full shadow-sm">World Test Championship 2025</span>
          <span className="bg-white px-2 py-1 rounded-full shadow-sm">Asia Cup 2025</span>
          {isLiveMatch && (
            <span className="flex items-center bg-red-500 text-white px-2 py-1 rounded-full shadow-md">
              Live Now
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-1 animate-pulse"></span>
            </span>
          )}
        </div>
      </div>

      {/* Mobile Tournament Selector */}
      <div className="bg-white py-2 px-4 md:hidden">
        <div className="flex justify-center">
          <select className="bg-white border border-gray-300 rounded-full px-4 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            <option>India tour of England 2025</option>
            <option>World Test Championship 2025</option>
            <option>Asia Cup 2025</option>
          </select>
        </div>
      </div>

      {/* Main navigation row */}
      <nav className="bg-white border-b border-gray-200 py-4 shadow-sm relative z-50">
        <div className="container mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center">
            {/* Left Group: Logo */}
            <div className="flex items-center pr-12">
              <NavLink to="/" className="flex items-center space-x-3">
                <img src="/icon.png" alt="Logo" className="w-10 h-10 ml-2" />
                <span className="text-2xl font-bold text-gray-800 font-serif">CRICKET</span>
              </NavLink>
            </div>

            {/* Center Group: Navigation Links */}
            <div className="flex items-center justify-center space-x-1">
              {navigationLinks.map((link, idx) => (
                <div key={idx} className="relative group" onMouseEnter={() => link.sublinks && setOpenSublink(link.name)} onMouseLeave={() => link.sublinks && setOpenSublink(null)}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full font-medium text-xs transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? "bg-red-500 text-white shadow-lg transform scale-105"
                          : "text-gray-700 hover:text-red-500 hover:bg-red-50"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                  {link.sublinks && openSublink === link.name && (
                    <div className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 grid grid-cols-3 gap-2 p-2">
                      {link.sublinks.map((sublink, subIdx) => (
                        <NavLink
                          key={subIdx}
                          to={sublink.path}
                          className={({ isActive }) =>
                            `block px-3 py-1 text-xs text-gray-700 hover:bg-red-50 hover:text-red-500 ${
                              isActive ? "bg-red-100" : ""
                            } truncate`
                          }
                        >
                          {sublink.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Group: Theme Toggle + Social Icons */}
            <div className="flex items-center space-x-3 pl-12">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-7 h-7" fill="#FFFFFF" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="#000000" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <div className="relative">
                <button
                  onClick={toggleSocialDropdown}
                  className="flex items-center justify-center p-1 bg-white text-gray-700 hover:text-red-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label="Toggle social icons"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                  </svg>
                </button>
                {isSocialDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col space-y-2 p-2">
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 bg-sky-400 hover:bg-sky-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987C18.634 23.974 24 18.607 24 11.987 24 5.367 18.634.001 12.017.001zm5.576 16.641c0 1.458-1.186 2.642-2.644 2.642H9.053c-1.458 0-2.644-1.184-2.644-2.642V7.359c0-1.458 1.186-2.642 2.644-2.642h5.896c1.458 0 2.644 1.184 2.644 2.642v9.282z"/>
                        <circle cx="12" cy="12" r="3.5"/>
                        <circle cx="17.5" cy="6.5" r="1"/>
                      </svg>
                    </a>
                    <a
                      href="https://telegram.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex lg:hidden items-center justify-between w-full">
            {/* Left: Logo */}
            <div className="flex items-center pr-4">
              <NavLink to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="/icon.png"
                  alt="Cricket Logo"
                  className="w-8 h-8 rounded-full object-cover shadow-lg"
                />
                <span className="text-base font-bold text-gray-800 font-serif">
                  CRICKET
                </span>
              </NavLink>
            </div>

            {/* Right Side: Theme Toggle + Social Icons + Hamburger */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-1.5 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6" fill="#FFFFFF" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="#000000" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <div className="relative">
                <button
                  onClick={toggleSocialDropdown}
                  className="flex items-center justify-center p-1.5 bg-white text-gray-700 hover:text-red-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label="Toggle social icons"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                  </svg>
                </button>
                {isSocialDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col space-y-2 p-2">
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 bg-sky-400 hover:bg-sky-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987C18.634 23.974 24 18.607 24 11.987 24 5.367 18.634.001 12.017.001zm5.576 16.641c0 1.458-1.186 2.642-2.644 2.642H9.053c-1.458 0-2.644-1.184-2.644-2.642V7.359c0-1.458 1.186-2.642 2.644-2.642h5.896c1.458 0 2.644 1.184 2.644 2.642v9.282z"/>
                        <circle cx="12" cy="12" r="3.5"/>
                        <circle cx="17.5" cy="6.5" r="1"/>
                      </svg>
                    </a>
                    <a
                      href="https://telegram.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </a>
                  </div>
                )}
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 bg-white text-gray-700 hover:text-red-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out">
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-2">
                  {navigationLinks.map((link, idx) => (
                    <div key={idx}>
                      <div
                        className="flex items-center justify-between w-full px-4 py-2 rounded-lg font-medium text-base text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                      >
                        <NavLink
                          to={link.path}
                          className={({ isActive }) =>
                            `flex-1 ${isActive ? "text-red-500 font-semibold" : ""}`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.name}
                        </NavLink>
                        {link.sublinks && (
                          <button
                            onClick={() => toggleSublink(link.name)}
                            className="ml-2 p-1"
                          >
                            <svg className={`w-5 h-5 transition-transform duration-200 ${openSublink === link.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {link.sublinks && openSublink === link.name && (
                        <div className="ml-6 mt-1 space-y-1">
                          {link.sublinks.map((sublink, subIdx) => (
                            <NavLink
                              key={subIdx}
                              to={sublink.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                `block px-4 py-1 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 ${
                                  isActive ? "bg-red-50 text-red-500" : ""
                                }`
                              }
                            >
                              {sublink.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;