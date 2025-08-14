import { useEffect, useState } from "react";
import { fetchNews } from "../utils/api";
import { Link } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function LatestNewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const newsData = await fetchNews();
        setNews(newsData);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  const mainArticle = news[0];
  const sideArticles = news.slice(1, 5);

  // Fallback link construction
  const getArticleLink = (article) => {
    // Assume match_id is available if it's a match-related article
    return article.match_id ? `/match/${article.match_id}` : `/news/${article.id || "default"}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Open Sans', sans-serif" }}>Latest News</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Stay up-to-date with the latest breaking news, match analysis, and exclusive interviews from the world of cricket.
        </p>
      </div>

      {/* News Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main article */}
        <Link
          to={getArticleLink(mainArticle) || "/"}
          className="relative rounded-xl overflow-hidden md:col-span-1 md:row-span-2 shadow-lg group"
        >
          <img
            src={mainArticle.image}
            alt={mainArticle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold">{mainArticle.title}</h3>
            <div className="flex items-center text-sm text-gray-300 mt-2">
              <FaRegCalendarAlt className="mr-2" />
              {/* Use current date as a fallback */}
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </div>
          </div>
        </Link>

        {/* Side articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 col-span-2">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              to={getArticleLink(article) || "/"}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-32 object-cover rounded-t-xl"
                />
                <div className="absolute top-2 left-2 bg-gray-900/60 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {article.season?.name || "News"}
                </div>
              </div>
              <div className="p-4 flex flex-col">
                <h4 className="font-bold text-base">{article.title}</h4>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center text-xs text-gray-400 mt-3">
                  <FaRegCalendarAlt className="mr-2" />
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}