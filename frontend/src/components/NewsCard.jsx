// src/components/NewsCard.jsx
import React from "react";

const NewsCard = ({ news }) => {
  if (!news) return null; // Prevent crash if news is undefined

  return (
    <a
      href={news.link || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
        <img
          src={news.image || "https://via.placeholder.com/600x400?text=No+Image"}
          alt={news.title || "News"}
          className="w-full h-40 object-cover group-hover:brightness-95 transition"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x400?text=Cricket+News";
          }}
        />
        <div className="p-4">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight group-hover:underline">
            {news.title || "No title available"}
          </h3>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <span>{news.publishedAt || "Unknown date"}</span>
            <span className="mx-1">•</span>
            <span>{news.source || "Unknown Source"}</span>
          </p>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;