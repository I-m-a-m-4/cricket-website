import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

// Hardcoded YouTube Videos
const hardcodedVideos = {
  featured: [
    {
      embedUrl: 'https://www.youtube.com/embed/bbI1SxikmFI',
      title: 'What will Kumble and Moody remember the World Cup for?',
      channelTitle: 'ESPNcricinfo',
      description: "Shami's wicket-taking spree, Afghanistan making a statement, and more",
      publishedAt: '2023-11-20T10:00:00Z',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/YqKYpgZ9FWU',
      title: 'World Cup 2023 Highlights',
      channelTitle: 'Cricket Official',
      description: 'Best moments from the tournament',
      publishedAt: '2023-11-22T12:00:00Z',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/kjQBq9PyaiA',
      title: 'ICC Test Team Rankings Breakdown',
      channelTitle: 'ICC',
      description: 'Current Test team standings explained',
      publishedAt: '2023-12-01T09:00:00Z',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/4k6HFA5NuHI',
      title: 'ICC ODI Player Rankings Update',
      channelTitle: 'ICC Official',
      description: 'Latest ODI player rankings analysis',
      publishedAt: '2023-11-25T08:00:00Z',
    },
  ],
  test: [
    {
      embedUrl: 'https://www.youtube.com/embed/kjQBq9PyaiA',
      title: 'ICC Test Team Rankings Breakdown',
      channelTitle: 'ICC',
      description: 'Current Test team standings explained',
      publishedAt: '2023-12-01T09:00:00Z',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/TQ5couH3DWo',
      title: 'Test Cricket Rankings History',
      channelTitle: 'Cricket Archive',
      description: 'Evolution of Test team rankings over time',
      publishedAt: '2023-12-02T11:00:00Z',
    },
  ],
  odi: [
    {
      embedUrl: 'https://www.youtube.com/embed/4k6HFA5NuHI',
      title: 'ICC ODI Player Rankings Update',
      channelTitle: 'ICC Official',
      description: 'Latest ODI player rankings analysis',
      publishedAt: '2023-11-25T08:00:00Z',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/VbwfPqfkkMM',
      title: 'Top Ranked ODI Players Discussion',
      channelTitle: 'Cricket Today',
      description: 'Expert discussion on current ODI rankings',
      publishedAt: '2023-11-26T10:00:00Z',
    },
  ],
  t20: [
    {
      embedUrl: 'https://www.youtube.com/embed/pFbBUcR7GGg',
      title: 'Top T20I Run Scorers 2023',
      channelTitle: 'Cricket Analysis',
      description: 'Top batsmen in T20I cricket',
      publishedAt: '2023-11-28T09:00:00Z',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/Gvw8xtvlZ5w',
      title: 'T20I Century Makers Compilation',
      channelTitle: 'ICC Highlights',
      description: 'All centuries from T20I matches in 2023',
      publishedAt: '2023-11-29T11:00:00Z',
    },
  ],
};

const fetchTopHeadlines = async (lang = 'en', country = '', q = 'cricket') => {
  try {
    const response = await axios.get(`${BASE_URL}/news/top-headlines`, {
      params: { lang, country, q, max: 15 },
      timeout: 10000,
    });
    return response.data.articles || [];
  } catch (error) {
    throw { error, retryAfter: error.response?.headers['retry-after'] || 60 };
  }
};

export default function NewsPage() {
  const [topHeadlines, setTopHeadlines] = useState([]);
  const [lang, setLang] = useState('en');
  const [country, setCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTopHeadlines = useCallback(async () => {
    try {
      const data = await fetchTopHeadlines(lang, country, searchQuery || 'cricket');
      setTopHeadlines(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.error.response?.status === 429
        ? `Rate limit exceeded. Please try again in ${err.retryAfter} seconds.`
        : err.error.message.includes('ECONNREFUSED') || err.error.message.includes('ECONNRESET')
        ? 'Cannot connect to the server. Please check if the server is running.'
        : 'Failed to load top headlines. Please try again.');
      setLoading(false);
    }
  }, [lang, country, searchQuery]);

  useEffect(() => {
    setLoading(true);
    loadTopHeadlines();
  }, [lang, country, searchQuery, loadTopHeadlines]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    loadTopHeadlines();
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* SEO Meta Tags */}
      <head>
        <title>Latest Cricket News & Top Headlines | Cricket App</title>
        <meta name="description" content="Stay updated with the latest cricket news, top headlines, and updates from around the world. Explore breaking news, match highlights, and more." />
        <meta name="keywords" content="cricket news, cricket headlines, cricket updates, cricket app, sports news" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Latest Cricket News & Top Headlines | Cricket App" />
        <meta property="og:description" content="Get the latest cricket news and top headlines. Stay informed with breaking news, match updates, and more." />
        <meta property="og:image" content="/stadium.jpg" />
        <meta property="og:url" content="https://your-frontend-url/news" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      {/* Hero Section */}
      <header className="relative bg-cover bg-center h-64 md:h-96" style={{ backgroundImage: 'url(/stadium.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/70 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg">
            Latest Cricket News & Headlines
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters and Search Bar */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 lg:mb-12" aria-label="News Filters">
          <form className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center" onSubmit={(e) => { e.preventDefault(); loadTopHeadlines(); }}>
            <div className="relative w-full sm:w-48">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full p-3 sm:p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 hover:bg-gray-50 text-gray-800 font-semibold appearance-none"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
              </select>
              <svg className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-5 sm:w-6 h-5 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="relative w-full sm:w-48">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 sm:p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 hover:bg-gray-50 text-gray-800 font-semibold appearance-none"
                aria-label="Select country"
              >
                <option value="">All Countries</option>
                <option value="in">India</option>
                <option value="au">Australia</option>
                <option value="gb">United Kingdom</option>
              </select>
              <svg className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-5 sm:w-6 h-5 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news (e.g., Test cricket, IPL)"
                className="w-full p-3 sm:p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 hover:bg-gray-50 text-gray-800 font-semibold"
                aria-label="Search news"
              />
              <svg className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-5 sm:w-6 h-5 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition duration-300 font-bold text-base sm:text-lg"
            >
              Search
            </button>
          </form>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(15).fill().map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                <div className="h-48 sm:h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <section className="text-center bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-10" aria-live="polite">
            <p className="text-red-600 text-lg sm:text-xl">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-4 sm:mt-6 px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition duration-300 font-bold"
            >
              Retry
            </button>
          </section>
        )}

        {/* Main Content Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Top Headlines Grid */}
            <section className="lg:col-span-3" aria-label="Top Cricket Headlines">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {topHeadlines.map((article, index) => (
                  <article
                    key={index}
                    className="bg-white transition duration-300"
                  >
                    <img
                      src={article.image || '/icc.jpg'}
                      alt={article.title}
                      className="w-full h-48 sm:h-64 object-cover"
                      onError={(e) => { e.target.src = '/icc.jpg'; }}
                    />
                    <div className="p-4 sm:p-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-red-500 line-clamp-2 mb-2 sm:mb-3">
                        {article.title}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 flex items-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {article.source} • {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-700 line-clamp-3 text-sm sm:text-base">{article.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* YouTube Videos Sidebar */}
            <section className="lg:col-span-1 lg:order-first bg-white shadow-lg rounded-2xl p-4 sm:p-6 h-auto" aria-label="Cricket Highlight Videos">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-b-2 border-red-600 pb-2">Highlight Videos</h2>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {hardcodedVideos.featured.map((video, index) => (
                  <article
                    key={index}
                    className="overflow-hidden"
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${video.embedUrl.split('embed/')[1].split('?')[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative aspect-video">
                        <img
                          src={`https://i.ytimg.com/vi/${video.embedUrl.split('embed/')[1].split('?')[0]}/hqdefault.jpg`}
                          alt={`${video.title} thumbnail`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/480x270?text=YouTube+Video';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-20 flex items-center justify-center transition-opacity">
                          <div className="w-12 sm:w-16 h-12 sm:h-16 bg-red-600 rounded-full flex items-center justify-center transform scale-90 hover:scale-100 transition-transform">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 sm:h-8 w-6 sm:w-8 text-white ml-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 sm:p-4">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-red-600 line-clamp-2 mb-1 sm:mb-2">
                          {video.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                          {video.channelTitle} •{' '}
                          {new Date(video.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-gray-700 line-clamp-3 text-xs sm:text-sm">{video.description}</p>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* No Headlines */}
        {!loading && !error && topHeadlines.length === 0 && (
          <section className="text-center bg-white rounded-2xl shadow-lg p-6 sm:p-8" aria-live="polite">
            <p className="text-gray-700 text-lg sm:text-xl">No top headlines found.</p>
            <button
              onClick={handleRetry}
              className="mt-4 sm:mt-6 px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition duration-300 font-bold"
            >
              Try Again
            </button>
          </section>
        )}
      </main>
    </div>
  );
}