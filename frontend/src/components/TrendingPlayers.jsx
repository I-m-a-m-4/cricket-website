import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

/**
 * Fetches the top players from the backend API.
 * @returns {Array} An array of top player data or an empty array on error.
 */
export const fetchTopPlayers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/players/top`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top players:", error);
        return [];
    }
};

const TrendingPlayers = () => {
    const [allPlayers, setAllPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [carouselPage, setCarouselPage] = useState(0);
    const playersPerPage = 6;

    const countryToFlag = {
        'India': '🇮🇳',
        'Afghanistan': '🇦🇫',
        'Ireland': '🇮🇪',
        'Pakistan': '🇵🇰',
        'Australia': '🇦🇺',
        'Sri Lanka': '🇱🇰',
        'Bangladesh': '🇧🇩',
        'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'West Indies': '🇻🇨',
        'South Africa': '🇿🇦',
        'New Zealand': '🇳🇿',
        'Zimbabwe': '🇿🇼'
    };

    useEffect(() => {
        const getPlayers = async () => {
            setLoading(true);
            const startTime = performance.now();
            const playersData = await fetchTopPlayers();
            const endTime = performance.now();
            console.log(`API call took ${Math.round(endTime - startTime)}ms`);

            if (playersData && playersData.length > 0) {
                setAllPlayers(playersData);
            }
            setLoading(false);
        };

        getPlayers();
    }, []);

    const displayedPlayers = allPlayers.slice(
        carouselPage * playersPerPage,
        carouselPage * playersPerPage + playersPerPage
    );

    const totalPages = Math.ceil(allPlayers.length / playersPerPage);
    const handleNext = () => {
        setCarouselPage((prevPage) => (prevPage + 1) % totalPages);
    };

    const handlePrev = () => {
        setCarouselPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    };

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-center text-4xl font-bold mb-10 text-gray-800">Trending Players</h2>
                <div className="flex justify-center flex-wrap gap-6">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="w-full max-w-[200px] text-center p-4 bg-gray-100 rounded-xl shadow-md animate-pulse border border-gray-200">
                            <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 bg-gray-300"></div>
                            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8 space-x-2">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-12 font-sans">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-4xl font-bold mb-10 text-gray-800">Trending Players</h2>

                {/* Desktop layout (6 columns) - only visible on lg and above (≥1024px) */}
                <div className="hidden lg:grid lg:grid-cols-6 gap-6 justify-items-center">
                    {displayedPlayers.map((player) => (
                        <div key={player.id} className="w-full max-w-[200px] text-center p-4 bg-gray-50 rounded-xl shadow-md border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                            <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
                                <img
                                    src={player.image_path || `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                                    alt={player.fullname}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                                />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{player.fullname}</h3>
                            <p className="text-sm text-gray-500">{player.position?.name}</p>
                        </div>
                    ))}
                </div>

                {/* Medium layout (2 rows of 3 columns) - visible only on md (768px–1023px) */}
                <div className="hidden md:grid md:grid-cols-3 md:gap-6 lg:hidden">
                    {displayedPlayers.map((player) => (
                        <div key={player.id} className="w-full max-w-[200px] text-center p-4 bg-gray-50 rounded-xl shadow-md border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                            <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
                                <img
                                    src={player.image_path || `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                                    alt={player.fullname}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                                />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{player.fullname}</h3>
                            <p className="text-sm text-gray-500">{player.position?.name}</p>
                        </div>
                    ))}
                </div>

                {/* Mobile carousel layout - visible only on screens < md (<768px) */}
                <div className="md:hidden relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${carouselPage * 100}%)` }}
                        >
                            {allPlayers.map((player) => (
                                <div key={player.id} className="w-full flex-shrink-0 text-center p-4 bg-gray-50 rounded-xl shadow-md border border-gray-100">
                                    <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
                                        <img
                                            src={player.image_path || `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                                            alt={player.fullname}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">{player.fullname}</h3>
                                    <p className="text-sm text-gray-500">{player.position?.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Navigation dots for mobile */}
                    {allPlayers.length > 0 && (
                        <div className="flex justify-center mt-4 space-x-2">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => setCarouselPage(index)}
                                    className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
                                        index === carouselPage ? 'bg-red-600 w-5' : 'bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Carousel navigation arrows (optional for mobile) */}
                {allPlayers.length > playersPerPage && (
                    <div className="md:hidden flex justify-between mt-4 px-4">
                        <button
                            onClick={handlePrev}
                            className="text-red-600 font-bold text-2xl"
                        >
                            ←
                        </button>
                        <button
                            onClick={handleNext}
                            className="text-red-600 font-bold text-2xl"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TrendingPlayers;