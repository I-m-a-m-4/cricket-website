// src/pages/RankingPage.jsx
import React, { useState, useEffect } from "react";
import { fetchTeamRankings, fetchCricketNews } from "../utils/api.js";

// --- Hardcoded YouTube Videos ---
const hardcodedVideos = {
  featured: [
    {
      embedUrl: 'https://www.youtube.com/embed/bbI1SxikmFI',
      title: 'What will Kumble and Moody remember the World Cup for?',
      channelTitle: 'ESPNcricinfo',
      description: "Shami's wicket-taking spree, Afghanistan making a statement, and more",
    },
    {
      embedUrl: 'https://www.youtube.com/embed/YqKYpgZ9FWU',
      title: 'World Cup 2023 Highlights',
      channelTitle: 'Cricket Official',
      description: 'Best moments from the tournament',
    },
  ],
  indiaMen: [
    {
      embedUrl: 'https://www.youtube.com/embed/AYSL-kGbUMU',
      title: "India Men's Team Training Session",
      channelTitle: 'BCCI',
      description: 'Exclusive behind-the-scenes footage',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/X1M6ak4-alM',
      title: 'Kohli Century Compilation',
      channelTitle: 'Cricket Highlights',
      description: 'Best centuries by Virat Kohli',
    },
  ],
  indiaWomen: [
    {
      embedUrl: 'https://www.youtube.com/embed/rG1BuEuGYzI',
      title: "India Women's Cricket Journey",
      channelTitle: 'BCCI Women',
      description: 'Rise of women cricket in India',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/TxXwlMfmNQc',
      title: 'Smriti Mandhana Best Shots',
      channelTitle: 'Women Cricket',
      description: 'Beautiful strokes compilation',
    },
  ],
  worldCup: [
    {
      embedUrl: 'https://www.youtube.com/embed/V2O8S4cwwO8',
      title: 'World Cup 2023 Final Highlights',
      channelTitle: 'ICC',
      description: 'The thrilling final match',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/nHFWwCsskwk',
      title: 'World Cup Best Catches',
      channelTitle: 'Cricket World',
      description: 'Spectacular catches from the tournament',
    },
  ],
  topWicketTakers: [
    {
      embedUrl: 'https://www.youtube.com/embed/PUf5Hq6f0Y4',
      title: 'Top Wicket Takers Analysis',
      channelTitle: 'Cricket Stats',
      description: 'Statistical breakdown of leading bowlers',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/0j2CV-__V48',
      title: 'Best Bowling Figures WC 2023',
      channelTitle: 'ESPN Cricinfo',
      description: 'Outstanding bowling performances',
    },
  ],
  topScorers: [
    {
      embedUrl: 'https://www.youtube.com/embed/pFbBUcR7GGg',
      title: 'Highest Run Scorers WC 2019',
      channelTitle: 'Cricket Analysis',
      description: 'Top batsmen of the tournament',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/Gvw8xtvlZ5w',
      title: 'Century Makers Compilation',
      channelTitle: 'ICC Highlights',
      description: 'All centuries from World Cup 2023',
    },
  ],
  askCricinfo: [
    {
      embedUrl: 'https://www.youtube.com/embed/SUipHDbAB5I',
      title: 'Ask Cricinfo: Rules Explained',
      channelTitle: 'ESPN Cricinfo',
      description: 'Cricket rules and regulations explained',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/oua9fcm8uhY',
      title: 'Cricket Trivia with Experts',
      channelTitle: 'Cricinfo Plus',
      description: 'Fun cricket facts and trivia',
    },
  ],
  iccPlayerRankings: [
    {
      embedUrl: 'https://www.youtube.com/embed/4k6HFA5NuHI',
      title: 'ICC Player Rankings Update',
      channelTitle: 'ICC Official',
      description: 'Latest player rankings analysis',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/VbwfPqfkkMM',
      title: 'Top Ranked Players Discussion',
      channelTitle: 'Cricket Today',
      description: 'Expert discussion on current rankings',
    },
  ],
  iccTeamRankings: [
    {
      embedUrl: 'https://www.youtube.com/embed/kjQBq9PyaiA',
      title: 'ICC Team Rankings Breakdown',
      channelTitle: 'ICC',
      description: 'Current team standings explained',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/TQ5couH3DWo',
      title: 'Team Rankings History',
      channelTitle: 'Cricket Archive',
      description: 'Evolution of team rankings over time',
    },
  ],
  '30years': [
    {
      embedUrl: 'https://www.youtube.com/embed/khfBUG7ntpw',
      title: '30 Years of ESPNcricinfo Journey',
      channelTitle: 'ESPN Cricinfo',
      description: 'Celebrating three decades of cricket coverage',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/sx01uJWKnz4',
      title: 'Cricket Evolution - 30 Years',
      channelTitle: 'Cricinfo Legacy',
      description: 'How cricket changed over 30 years',
    },
  ],
};

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState("Test");
  const [rankings, setRankings] = useState([]);
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState(null);

  // Tabs: Test, ODIs, T20I
  const tabs = ["Test", "ODIs", "T20I"];

  useEffect(() => {
    const loadRankings = async () => {
      setLoadingRankings(true);
      try {
        const rankingsData = await fetchTeamRankings(activeTab, 'men');
        setRankings(rankingsData);
        setError(null);
      } catch (err) {
        console.error("Failed to load team rankings:", err);
        setError("Could not load rankings. Please try again later.");
        setRankings([]);
      } finally {
        setLoadingRankings(false);
      }
    };

    loadRankings();
  }, [activeTab]);

  // Load News
  useEffect(() => {
    const loadNews = async () => {
      setLoadingNews(true);
      try {
        const data = await fetchCricketNews();
        const filtered = data.filter(article =>
          /cricket.*?(match|score|team|series|tournament|world cup|ipl|odi|t20|test|squad|captain|wicket|six|century)/i.test(
            article.title + ' ' + (article.description || '')
          )
        );
        setNews(filtered.slice(0, 4)); // Limit to 4
      } catch (err) {
        console.error("Failed to load news:", err);
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    };

    loadNews();
  }, []);

  // Load Videos
  useEffect(() => {
    setLoadingVideos(true);
    const selectedKey = activeTab === 'ODIs' ? 'ODI' : activeTab.replace('I', ''); // Test → Test, T20I → T20
    const videoKey = selectedKey.toLowerCase();
    const videoList = hardcodedVideos[videoKey] || hardcodedVideos.featured;

    // Simulate loading delay for UX
    setTimeout(() => {
      setVideos(videoList);
      setLoadingVideos(false);
    }, 300);
  }, [activeTab]);

  return (
    <div className="ranking-page bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Cricket Rankings - Men's Teams</h1>
        {error && (
          <p className="text-red-600 text-sm italic mb-6">{error}</p>
        )}

        {/* Format Tabs */}
        <div className="flex border-b border-gray-300 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm md:text-base focus:outline-none transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-red-600 border-red-600"
                  : "text-gray-600 border-transparent hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Rankings Table */}
          <div className="lg:col-span-2">
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
                              alt={team.name}
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
          </div>

          {/* Videos Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Videos</h2>
            {loadingVideos ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                    <div className="w-full aspect-video bg-gray-300 rounded-lg"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mt-1"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {videos.slice(0, 2).map((video, index) => (
                  <a
                    key={index}
                    href={`https://www.youtube.com/watch?v=${video.embedUrl.split('embed/')[1].split('?')[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow aspect-video">
                      <img
                        src={`https://i.ytimg.com/vi/${video.embedUrl.split('embed/')[1].split('?')[0]}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/480x270?text=YouTube+Video";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 flex items-center justify-center transition-opacity">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{video.channelTitle}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Latest News Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Cricket News</h2>
          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image || `https://source.unsplash.com/random/300x200/?cricket,${item.title.split(' ')[0]}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=Cricket+News";
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {activeTab}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 flex-1">
                        {item.description || 'Read more about this exciting cricket update.'}
                      </p>
                      <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
                        <span>{item.source || 'ESPNcricinfo'}</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent news available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;