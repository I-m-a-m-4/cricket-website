// src/pages/RankingPage.jsx
import React, { useState, useEffect } from "react";
import { fetchTeamRankings, fetchCricketNews } from "../utils/api.js"; // Make sure path is correct
import NewsCard from "../components/NewsCard.jsx";

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState("Test");
  const [rankings, setRankings] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  // Fetch team rankings
  useEffect(() => {
    const loadRankings = async () => {
      setLoadingRankings(true);
      try {
        const data = await fetchTeamRankings(activeTab, "male");
        setRankings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load rankings:", err);
        setRankings([]);
      } finally {
        setLoadingRankings(false);
      }
    };

    loadRankings();
  }, [activeTab]);

  // Fetch real cricket news
  useEffect(() => {
    const loadNews = async () => {
      setLoadingNews(true);
      try {
        const data = await fetchCricketNews();
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load news:", err);
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    };

    loadNews();
  }, []);

  const tabs = ["Test", "ODIs", "T20"];

  return (
    <div className="ranking-page bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cricket Rankings - Men's Teams</h1>

        {/* Format Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm focus:outline-none transition-colors ${
                activeTab === tab
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loadingRankings ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Loading rankings...</td>
                </tr>
              ) : rankings.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No rankings available.</td>
                </tr>
              ) : (
                rankings.map((team, index) => (
                  <tr key={team.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={team.image_path || `https://via.placeholder.com/40x40?text=${team.name?.[0] || 'T'}`}
                          alt={team.name || "Team"}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                          onError={(e) => {
                            e.target.src = `https://avatar.vercel.sh/${team.name || 'cricket'}.png?text=${team.name?.[0] || 'T'}`;
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{team.name || "Unknown Team"}</div>
                          <div className="text-xs text-gray-500">{team.country?.name || team.code || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {team.rating || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* News & Videos Section */}
        <div className="mt-8 flex flex-col md:flex-row gap-6">
          {/* Latest News */}
          <div className="md:w-2/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Cricket News</h2>
            {loadingNews ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-white rounded-lg shadow animate-pulse">
                    <div className="h-40 bg-gray-200 rounded mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : news.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {news.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No news articles found.</p>
            )}
          </div>

          {/* Popular Videos */}
          <div className="md:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Videos</h2>
            <div className="space-y-4">
              {[
                "https://i.ytimg.com/vi/7mXDSjYwKnE/hqdefault.jpg",
                "https://i.ytimg.com/vi/4kRQnSb7KzA/hqdefault.jpg",
              ].map((thumb, index) => (
                <a
                  key={index}
                  href={`https://www.youtube.com/watch?v=${["7mXDSjYwKnE", "4kRQnSb7KzA"][index]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={thumb}
                      alt="YouTube video"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x225?text=Video+Not+Available";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-500 bg-opacity-80 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;