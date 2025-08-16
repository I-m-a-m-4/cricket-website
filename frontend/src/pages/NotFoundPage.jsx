import React from 'react';
import { Link } from 'react-router-dom';
import { GiCricketBat } from 'react-icons/gi'; // Changed to GiCricketBat from game-icons

const NotFoundPage = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 bg-white min-h-screen flex items-center justify-center"  style={{
    backgroundImage: "url('/404bggt.jpg')",
    backgroundPosition: "center",   // centers the image
    backgroundRepeat: "no-repeat",  // prevents tiling
    backgroundSize: "cover",        // makes it fill the container
    width: "100%",
    height: "100vh",                // full screen height
  }}>
    
      <div className="text-center bg-black bg-opacity-20 p-8 rounded-lg shadow-lg">
        {/* Icon and Title */}
        <div className="flex justify-center mb-6">
          <GiCricketBat className="text-6xl text-red-500 animate-pulse" />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          404 - Lost Wicket!
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          Oops! It seems you’ve wandered off the pitch. The page you’re looking for doesn’t exist or has been retired.
        </p>

      
        {/* Call to Action */}
        <Link
          to="/home"
          className="inline-block px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
        >
          Back to Home Ground
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;