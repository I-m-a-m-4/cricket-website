import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNews } from '../utils/api';
import { FaRegCalendarAlt } from 'react-icons/fa';

const NewsPage = () => {
  const { id } = useParams(); // Get id from URL
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getArticle = async () => {
      try {
        const newsData = await fetchNews();
        const foundArticle = newsData.find(a => a.id === id);
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError('Failed to load article.');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }, [id]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto"></div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error || 'Article not found.'}</p>
        <Link to="/home" className="mt-4 inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-64 object-cover rounded-t-xl mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          {article.title}
        </h1>
        <div className="flex items-center text-gray-500 mb-4">
          <FaRegCalendarAlt className="mr-2" />
          <span>{new Date(article.created_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
        </div>
        <p className="text-gray-700">{article.description}</p>
        {article.link && (
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Read Full Article
          </a>
        )}
      </div>
    </section>
  );
};

export default NewsPage;