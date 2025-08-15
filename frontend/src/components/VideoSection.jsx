import React, { useState, useEffect, Fragment } from 'react';
import { FaPlayCircle, FaRegEye, FaShareAlt } from 'react-icons/fa';
import { PiClock } from "react-icons/pi";
import { fetchVideos } from '../utils/api';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const filterQueries = {
    'Latest': 'cricket highlights',
    'Highlights': 'cricket match highlights',
    'Featured': 'cricket featured videos',
    'Interviews': 'cricket player interviews',
    'Press Conferences': 'cricket press conferences'
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Skeleton Component for Video Card
const VideoCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 animate-pulse w-64 flex-shrink-0">
    <div className="relative">
      <div className="w-full h-40 bg-gray-300"></div>
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
      </div>
    </div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function VideosSection() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Latest');
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const filters = Object.keys(filterQueries);

    useEffect(() => {
        const getVideos = async () => {
            setLoading(true);
            try {
                const query = filterQueries[activeFilter];
                const videosData = await fetchVideos(query);
                setVideos(videosData);
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
            if (distance > minSwipeDistance && videos.length > 1) {
                const scrollContainer = document.querySelector('.video-carousel');
                scrollContainer.scrollLeft += scrollContainer.offsetWidth / videos.length;
            } else if (distance < -minSwipeDistance && videos.length > 1) {
                const scrollContainer = document.querySelector('.video-carousel');
                scrollContainer.scrollLeft -= scrollContainer.offsetWidth / videos.length;
            }
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <section className="bg-gray-100 max-w-7xl mx-auto py-12">
            <div className="px-4">
                <div className="flex justify-between items-center mb-10 flex-wrap">
                    <h2 className="text-4xl font-bold mb-2">Videos</h2>
                    {/* Desktop Filters */}
                    <div className="hidden md:flex space-x-2 overflow-x-auto pb-2">
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
                    {/* Mobile Advanced Dropdown */}
                    <div className="md:hidden flex justify-center mb-8 w-full">
                        <Menu as="div" className="relative inline-block text-left w-full max-w-xs">
                            <div>
                                <Menu.Button className="inline-flex w-full justify-between items-center rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600">
                                    {activeFilter}
                                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-20 mt-2 w-full origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {filters.map((filter) => (
                                            <Menu.Item key={filter}>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => setActiveFilter(filter)}
                                                        className={classNames(
                                                            active ? 'bg-gray-700 text-white' : 'text-gray-300',
                                                            'block px-4 py-2 text-sm w-full text-left'
                                                        )}
                                                    >
                                                        {filter}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>

                {/* Carousel for Mobile, Grid for Desktop */}
                <div className="md:hidden">
                    <div
                        className="video-carousel overflow-x-scroll flex snap-x snap-mandatory scroll-smooth pb-4"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ 
                            scrollBehavior: 'smooth',
                            scrollbarWidth: 'none', // Firefox
                            msOverflowStyle: 'none', // IE and Edge
                        }}
                    >
                        <div className="flex justify-center">
                            <div className="flex space-x-6" style={{ marginLeft: '-1rem', marginRight: '-1rem' }}>
                                {loading || videos.length === 0 ? (
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <VideoCardSkeleton key={index} />
                                    ))
                                ) : (
                                    videos.map(video => (
                                        <a
                                            key={video.id}
                                            href={`https://www.youtube.com/watch?v=${video.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 block transform hover:scale-105 transition-transform duration-300 snap-center w-64 flex-shrink-0"
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
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Hide scrollbar for Webkit browsers (Chrome, Safari) */}
                    <style jsx>{`
                        .video-carousel::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                </div>
                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-4 gap-6">
                    {loading || videos.length === 0 ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <VideoCardSkeleton key={index} />
                        ))
                    ) : (
                        videos.map(video => (
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
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}