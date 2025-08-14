import React, { useState, useEffect } from 'react';
import { FaPlayCircle, FaRegEye, FaShareAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PiClock } from "react-icons/pi";
import { fetchVideos } from '../utils/api';

const filterQueries = {
    'Latest': 'cricket highlights',
    'Highlights': 'cricket match highlights',
    'Featured': 'cricket featured videos',
    'Interviews': 'cricket player interviews',
    'Press Conferences': 'cricket press conferences'
};

const VIDEOS_PER_PAGE = 4;

export default function VideosSection() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Latest');
    const [currentPage, setCurrentPage] = useState(0);

    const filters = Object.keys(filterQueries);
    const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
    const currentVideos = videos.slice(
        currentPage * VIDEOS_PER_PAGE,
        (currentPage + 1) * VIDEOS_PER_PAGE
    );

    useEffect(() => {
        const getVideos = async () => {
            setLoading(true);
            try {
                const query = filterQueries[activeFilter];
                const videosData = await fetchVideos(query);
                setVideos(videosData);
                setCurrentPage(0); // Reset to first page on new filter
            } catch (error) {
                console.error("Failed to fetch videos:", error);
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };
        getVideos();
    }, [activeFilter]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    // A beautiful loading animation
    if (loading) {
        return (
            <section className="max-w-7xl bg-gray-100 mx-auto px-4 py-12 flex items-center justify-center">
                <div className="relative w-20 h-20">
                    <div className="absolute w-full h-full rounded-full border-4 border-[#DD242D] border-t-transparent animate-spin-slow"></div>
                    <div className="absolute top-1/2 left-1/2 w-10 h-10 -mt-5 -ml-5 rounded-full border-4 border-[#FF4535] border-l-transparent animate-spin-fast"></div>
                </div>
            </section>
        );
    }

    if (videos.length === 0) {
        return null;
    }

    return (
        <section className="bg-gray-100 max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-10 flex-wrap">
                <h2 className="text-4xl font-bold mb-2">Videos</h2>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`py-2 px-4 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap ${
                                activeFilter === filter
                                    ? 'bg-[#DD242D] text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center">
                <button
                    onClick={handlePrevPage}
                    className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={totalPages <= 1}
                >
                    <FaChevronLeft />
                </button>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mx-4">
                    {currentVideos.map(video => (
                        <a
                            key={video.id}
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 block transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="relative">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                    <FaPlayCircle className="text-white text-5xl opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="font-bold text-sm line-clamp-2 mb-2">{video.title}</p>
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                    <span className="flex items-center mr-4">
                                        <PiClock className="mr-1" /> {formatDate(video.publishedAt)}
                                    </span>
                                    <span className="flex items-center">
                                        <FaRegEye className="mr-1" />
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-400 mt-4">
                                    <span>{video.channelTitle}</span>
                                    <FaShareAlt className="cursor-pointer hover:text-gray-600 transition-colors" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                <button
                    onClick={handleNextPage}
                    className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={totalPages <= 1}
                >
                    <FaChevronRight />
                </button>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
                            index === currentPage ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                    ></span>
                ))}
            </div>
        </section>
    );
}