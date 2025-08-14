import React from 'react';

function Footer() {
  return (
    <footer className="font-sans bg-[#122e47] text-white">
      {/* Main content container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Logo row - centered on all screens */}
        <div className="flex justify-center  mb-6">
          <a href="/" className="flex items-center space-x-3">
            <img src="/icon.png" alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-white font-serif">CRICKET</span>
          </a>
        </div>
        
        {/* Navigation bar - boxed on mobile, full-width on desktop */}
        <div className="w-full bg-[#122537] border-r-4 py-3 mb-4 sm:px-0">
          <div className="mx-auto sm:max-w-6xl">
            <div className="bg-[#122537] rounded-lg sm:rounded-none px-4 py-3 sm:p-0">
              <div className="flex flex-col sm:flex-row flex-wrap justify-start sm:justify-center items-start sm:items-center gap-y-3 gap-x-8 text-[15px]">
                <a href="#" className="hover:text-gray-300">Home</a>
                <a href="#" className="hover:text-gray-300">Cricket</a>
                <a href="#" className="hover:text-gray-300">Match</a>
                <a href="#" className="hover:text-gray-300">Ranking</a>
                <a href="#" className="hover:text-gray-300">Live match</a>
                <a href="#" className="hover:text-gray-300">Contact</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social icons - centered on all screens with bottom border */}
        <div className="flex justify-center space-x-3 pb-4 mb-4 border-b border-[#727272]">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sky-400 hover:bg-sky-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987C18.634 23.974 24 18.607 24 11.987 24 5.367 18.634.001 12.017.001zm5.576 16.641c0 1.458-1.186 2.642-2.644 2.642H9.053c-1.458 0-2.644-1.184-2.644-2.642V7.359c0-1.458 1.186-2.642 2.644-2.642h5.896c1.458 0 2.644 1.184 2.644 2.642v9.282z"/>
              <circle cx="12" cy="12" r="3.5"/>
              <circle cx="17.5" cy="6.5" r="1"/>
            </svg>
          </a>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
        </div>

        {/* Copyright text - centered on all screens */}
        <div className="text-[15px] text-white text-center">
          ©2025 Cricket All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;