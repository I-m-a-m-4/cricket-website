import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchTeamRankings } from '../utils/api.js';

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

const fetchCricketNews = async (lang = 'en', country = '') => {
  try {
    const response = await axios.get(`${BASE_URL}/news/top-headlines`, {
      params: { lang, country, max: 4 },
      timeout: 10000,
    });
    if (!response.data.articles) {
      throw new Error('No articles returned from API');
    }
    return response.data.articles.map(article => ({
      ...article,
      slug: article.url.split('/').pop().replace(/.html$/, '').replace(/-/g, ' '),
    }));
  } catch (error) {
    throw {
      error,
      retryAfter: error.response?.headers['retry-after'] || 60,
      message: error.response?.status === 401
        ? 'Invalid API token. Please check your GNews API configuration.'
        : error.response?.status === 429
        ? `Rate limit exceeded. Please try again in ${error.response?.headers['retry-after'] || 60} seconds.`
        : error.message.includes('ECONNREFUSED') || error.message.includes('ECONNRESET')
        ? 'Cannot connect to the server. Please check if the server is running.'
        : 'Failed to load news. Please try again.',
    };
  }
};

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState('Test');
  const [rankings, setRankings] = useState([]);
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ['Test', 'ODIs', 'T20I'];

  const loadRankings = useCallback(async () => {
    setLoadingRankings(true);
    try {
      const rankingsData = await fetchTeamRankings(activeTab, 'men');
      setRankings(rankingsData);
      setError(null);
    } catch (err) {
      setError(
        err.message.includes('ECONNREFUSED') || err.message.includes('ECONNRESET')
          ? 'Cannot connect to the server. Please check if the server is running.'
          : 'Could not load rankings. Please try again later.'
      );
      setRankings([]);
    } finally {
      setLoadingRankings(false);
    }
  }, [activeTab]);

  const loadNews = useCallback(async () => {
    setLoadingNews(true);
    try {
      const data = await fetchCricketNews('en', '');
      setNews(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    loadRankings();
    loadNews();
  }, [activeTab, loadRankings, loadNews]);

  useEffect(() => {
    setLoadingVideos(true);
    const videoKey = activeTab === 'ODIs' ? 'odi' : activeTab.toLowerCase().replace('i', '');
    const videoList = hardcodedVideos[videoKey] || hardcodedVideos.featured;
    setTimeout(() => {
      setVideos(videoList);
      setLoadingVideos(false);
    }, 300);
  }, [activeTab]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SEO Meta Tags */}
      <head>
        <title>Cricket Team Rankings & News | Test, ODIs, T20I | Cricket App</title>
        <meta
          name="description"
          content="Explore ICC men's cricket team rankings for Test, ODIs, and T20I formats, along with latest cricket news and highlight videos."
        />
        <meta
          name="keywords"
          content="cricket rankings, ICC rankings, Test cricket, ODI rankings, T20I rankings, cricket news, cricket videos, cricket app"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Cricket Team Rankings & News | Test, ODIs, T20I | Cricket App" />
        <meta
          property="og:description"
          content="Discover ICC men's cricket team rankings, latest news, and highlight videos for Test, ODIs, and T20I formats."
        />
        <meta property="og:image" content="/stadium.jpg" />
        <meta property="og:url" content="https://your-frontend-url/rankings" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <header className="relative bg-cover bg-center h-64 md:h-96" style={{ backgroundImage: 'url(/stadium.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Cricket Team Rankings, News & Highlights
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <section className="text-center bg-white rounded-xl shadow-md p-6 mb-8" aria-live="polite">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoadingRankings(true);
                setLoadingNews(true);
                loadRankings();
                loadNews();
              }}
              className="mt-4 px-6 py-3 bg-[#122e47] text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Retry
            </button>
          </section>
        )}

        {/* Format Tabs */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8 sticky top-0 z-10" aria-label="Cricket Format Tabs">
          <div className="flex border-b border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold text-sm md:text-base focus:outline-none transition-colors border-b-2 ${
                  activeTab === tab ? 'text-red-600 border-red-600' : 'text-gray-600 border-transparent hover:text-gray-800'
                }`}
                aria-current={activeTab === tab ? 'true' : 'false'}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rankings Table */}
          <section className="lg:col-span-2" aria-label={`${activeTab} Team Rankings`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white">
                <h2 className="text-xl font-bold">{activeTab} Team Rankings</h2>
              </div>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">Pos</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingRankings ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500">Loading rankings...</td>
                    </tr>
                  ) : rankings.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No rankings available.</td>
                    </tr>
                  ) : (
                    rankings.map((team, index) => (
                      <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={team.image_path}
                              alt={`${team.name} logo`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              onError={(e) => {
                                e.target.src = `https://avatar.vercel.sh/${team.name}.png?text=${team.name.charAt(0)}`;
                              }}
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{team.name}</div>
                              <div className="text-xs text-gray-500">{team.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-mono text-gray-800">
                          {typeof team.rating === 'number' ? team.rating.toFixed(1) : team.rating}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Videos Grid */}
          <section aria-label="Cricket Highlight Videos">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Highlight Videos</h2>
            {loadingVideos ? (
              <div className="grid grid-cols-1 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
                    <div className="w-full aspect-video bg-gray-300 rounded-lg"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mt-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {videos.slice(0, 2).map((video, index) => (
                  <article
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-transparent hover:border-red-600"
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${video.embedUrl.split('embed/')[1].split('?')[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={`https://i.ytimg.com/vi/${video.embedUrl.split('embed/')[1].split('?')[0]}/hqdefault.jpg`}
                          alt={`${video.title} thumbnail`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/480x270?text=YouTube+Video';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-20 flex items-center justify-center transition-opacity">
                          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center transform scale-90 hover:scale-100 transition-transform">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-white ml-1"
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
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 hover:text-red-600 line-clamp-2 mb-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {video.channelTitle} •{' '}
                          {new Date(video.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-gray-600 line-clamp-3 mb-4">{video.description}</p>
                        <span className="inline-block px-4 py-2 bg-[#122e47] text-white text-sm rounded-full hover:bg-red-600 transition duration-300">
                          Watch Now
                        </span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* News List */}
        <section className="mt-12" aria-label="Latest Cricket News">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Latest Cricket News</h2>
          {loadingNews ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse border-b-2 border-[#171f1e]">
                  <div className="flex flex-col sm:flex-row p-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-1/3 h-48 bg-gray-300 rounded-lg"></div>
                    <div className="w-full sm:w-2/3 space-y-3">
                      <div className="h-6 bg-gray-300 rounded w-4/5"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/5"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="space-y-6">
              {news.map((article, index) => (
                <article
                  key={index}
                  className={`border-b-2 border-black ${index === news.length - 1 ? '' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row p-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <img
                      src={article.image || '/icc.jpg'}
                      alt={article.title}
                      className="w-full sm:w-1/3 h-48 object-cover rounded-lg"
                      onError={(e) => { e.target.src = '/icc.jpg'; }}
                    />
                    <div className="w-full sm:w-2/3">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {article.source} •{' '}
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-600 line-clamp-3 mb-4 font-roboto">
                        {article.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-600 text-lg">{error || 'No recent news found.'}</p>
              <button
                onClick={() => {
                  setError(null);
                  loadNews();
                }}
                className="mt-4 px-6 py-3 bg-[#122e47] text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Try Again
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default RankingPage;