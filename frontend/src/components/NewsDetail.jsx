import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const NewsDetail = () => {
  const { url } = useParams();
  const decodedUrl = decodeURIComponent(url);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/news`, {
          params: { url: decodedUrl },
          timeout: 10000,
        });
        const articles = response.data.articles || [];
        if (articles.length === 0) {
          throw new Error('Article not found');
        }
        const matchedArticle = articles[0]; // Backend ensures single article
        setArticle(matchedArticle);
        setError(null);
      } catch (err) {
        setError(
          err.response?.status === 429
            ? `Rate limit exceeded. Please try again in ${err.response?.headers['retry-after'] || 60} seconds.`
            : err.message.includes('ECONNREFUSED') || err.message.includes('ECONNRESET')
            ? 'Cannot connect to the server. Please check if the server is running.'
            : err.message === 'Article not found'
            ? 'Article not found. It may have been removed or is unavailable.'
            : 'Failed to load article. Please try again.'
        );
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [decodedUrl]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SEO Meta Tags */}
      <head>
        <title>{article ? `${article.title} | Cricket News` : 'Cricket News Article'}</title>
        <meta
          name="description"
          content={article ? article.description : 'Read the latest cricket news and updates.'}
        />
        <meta
          name="keywords"
          content="cricket news, cricket updates, cricket article, cricket app"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content={article ? `${article.title} | Cricket News` : 'Cricket News Article'}
        />
        <meta
          property="og:description"
          content={article ? article.description : 'Read the latest cricket news and updates.'}
        />
        <meta property="og:image" content={article ? article.image || '/icc.jpg' : '/icc.jpg'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="animate-pulse bg-white rounded-xl shadow-md p-6">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        )}

        {error && (
          <div className="text-center bg-white rounded-xl shadow-md p-6" aria-live="polite">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchArticle();
              }}
              className="mt-4 px-6 py-3 bg-[#122e47] text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {article && !loading && !error && (
          <article className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <img
              src={article.image || '/icc.jpg'}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
              onError={(e) => { e.target.src = '/icc.jpg'; }}
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{article.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
              {article.source} •{' '}
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="text-gray-600 mb-6">{article.content || article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#122e47] text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Read Full Article
            </a>
          </article>
        )}
      </main>
    </div>
  );
};

export default NewsDetail;