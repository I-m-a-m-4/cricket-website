import React, { useState, useEffect } from 'react';
import { fetchNews } from '../utils/api'; // Adjust path as needed based on your project structure

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

function InDepthSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const newsData = await fetchNews();
        setNews(newsData.slice(0, 3)); // Limit to 3 articles
      } catch (err) {
        setError("Failed to fetch news data.");
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, []);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const minSwipeDistance = 50; // Minimum distance to trigger swipe
      if (distance > minSwipeDistance) {
        setCurrentSlide((prev) => Math.min(prev + 1, news.length - 1));
      } else if (distance < -minSwipeDistance) {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (error) {
    return (
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (loading || news.length === 0) {
    return (
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <p className="text-gray-500">No news articles found.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 text-gray-800 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12" style={{ fontFamily: "'Roboto', sans-serif" }}>In Depth</h2>

        {/* Three-box layout for large screens */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6">
          {news.map((item, index) => {
            const bulletPoints = item.description
              ? item.description.split('. ').filter(sentence => sentence.trim() !== '')
              : ['No detailed report available.'];

            return (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative">
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-t-xl" />
                  <div className="absolute bottom-0 left-0 bg-[#D30A11] text-white text-xs font-bold px-3 py-1 rounded-tr-xl">
                    {item.category || 'News'} {/* Changed from season to category for NewsData.io */}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">{item.title}</h3>
                  <ul className="text-gray-600 text-base space-y-2">
                    {bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="h-2 w-2 bg-[#D30A11] rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel for mobile screens */}
        <div className="md:hidden">
          <div
            className="relative max-w-sm mx-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative">
                <img src={news[currentSlide].image} alt={news[currentSlide].title} className="w-full h-auto object-cover rounded-t-xl" />
                <div className="absolute bottom-0 left-0 bg-[#D30A11] text-white text-xs font-bold px-3 py-1 rounded-tr-xl">
                  {news[currentSlide].category || 'News'} {/* Changed from season */}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">{news[currentSlide].title}</h3>
                <ul className="text-gray-600 text-base space-y-2">
                  {news[currentSlide].description
                    ? news[currentSlide].description.split('. ').filter(sentence => sentence.trim() !== '').map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="h-2 w-2 bg-[#D30A11] rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span>{point}</span>
                      </li>
                    ))
                    : ['No detailed report available.'].map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="h-2 w-2 bg-[#D30A11] rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Pagination dots for navigation */}
            <div className="flex justify-center mt-6">
              {news.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 w-2 mx-1 rounded-full cursor-pointer transition-all duration-300 ${
                    index === currentSlide ? 'bg-[#D30A11] w-5' : 'bg-gray-400'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InDepthSection;