import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API configuration and functions
const BASE_URL = 'http://localhost:3001/api';

/**
 * Fetches the top players from the backend API.
 * @returns {Array} An array of top player data or an empty array on error.
 */
export const fetchTopPlayers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/players/top`);
        // The API returns the data in a nested 'data' property.
        // We assume the local server endpoint has already processed this.
        return response.data;
    } catch (error) {
        console.error("Error fetching top players:", error);
        return [];
    }
};

const TrendingPlayers = () => {
    // State to manage the list of all players fetched from the API
    const [allPlayers, setAllPlayers] = useState([]);
    // State to manage the currently selected filter category
    const [activeFilter, setActiveFilter] = useState('All');
    // State to hold the unique filter categories (countries) derived from the player data
    const [filters, setFilters] = useState([]);
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to manage the current page of the carousel
    const [carouselPage, setCarouselPage] = useState(0);
    // Number of players to show per page in the carousel
    const playersPerPage = 6;

    // A simple mapping of country names to flag emojis
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
    
    // Effect hook to fetch players from the API when the component mounts
    useEffect(() => {
        const getPlayers = async () => {
            try {
                setLoading(true);
                const playersData = await fetchTopPlayers();
                
                if (playersData && playersData.length > 0) {
                    setAllPlayers(playersData);
                    
                    // Extract unique countries from the fetched player data and add an 'All' filter
                    const uniqueCountries = [...new Set(playersData.map(player => player.country?.name).filter(Boolean))].sort();
                    setFilters(['All', ...uniqueCountries]);
                }
            } catch (error) {
                console.error("Failed to fetch players:", error);
            } finally {
                setLoading(false);
            }
        };

        getPlayers();
    }, []);

    // Derived state for players to display based on the active filter
    const filteredPlayers = activeFilter === 'All'
        ? allPlayers
        : allPlayers.filter(player => player.country?.name === activeFilter);
        
    // Calculate the total number of pages for the carousel
    const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

    // Get the players for the current carousel page
    const displayedPlayers = filteredPlayers.slice(
        carouselPage * playersPerPage,
        carouselPage * playersPerPage + playersPerPage
    );

    // Handle carousel navigation
    const handleNext = () => {
        setCarouselPage((prevPage) => (prevPage + 1) % totalPages);
    };

    const handlePrev = () => {
        setCarouselPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    };

    // Simple loading state
    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[500px]">
                <div className="flex items-center justify-center">
                    <div className="relative w-20 h-20">
                        <div className="absolute w-full h-full rounded-full border-4 border-[#DD242D] border-t-transparent animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 w-10 h-10 -mt-5 -ml-5 rounded-full border-4 border-[#FF4535] border-l-transparent animate-spin-reverse"></div>
                    </div>
                </div>
                <style>{`
                    @keyframes spin-reverse {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(-360deg); }
                    }
                `}</style>
            </section>
        );
    }
    
    return (
        <section className="bg-white py-12 font-sans">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-4xl font-bold mb-10 text-gray-800">Trending Players</h2>
                <div className="flex justify-center flex-wrap gap-2 mb-10">
                    {filters.map((filterName) => (
                        <button
                            key={filterName}
                            onClick={() => {
                                setActiveFilter(filterName);
                                setCarouselPage(0); // Reset carousel on filter change
                            }}
                            className={`flex items-center space-x-2 py-2 px-4 rounded-full font-semibold transition-colors duration-300 ${
                                activeFilter === filterName
                                    ? 'bg-red-600 text-white shadow-lg'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            {countryToFlag[filterName] && <span className="text-lg">{countryToFlag[filterName]}</span>}
                            <span>{filterName}</span>
                        </button>
                    ))}
                </div>
                
                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center transition-transform duration-500 ease-in-out">
                        {displayedPlayers.length > 0 ? (
                            displayedPlayers.map((player) => (
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
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">No players found for this selection.</div>
                        )}
                    </div>
                </div>
                
                {/* Carousel navigation dots */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCarouselPage(index)}
                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                    carouselPage === index ? 'bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TrendingPlayers;
