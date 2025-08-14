import React, { useState, useEffect, useRef } from 'react';
import { fetchAllMatches, fetchAusIndMatches, fetchLegendsLeagueMatches, fetchLiveMatches, fetchUpcomingMatches } from '../utils/api';
import MatchCard from '../components/MatchCard';
import { BallTriangle } from 'react-loader-spinner';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const filters = [
  { id: 'live', label: 'Live Matches' },
  { id: 'upcoming', label: 'Upcoming Matches' },
  { id: 'finished', label: 'Finished Matches' },
  { id: 'all-matches', label: 'All Matches' },
  { id: 'aus-ind', label: 'AUS vs IND' },
  { id: 'legends-league', label: 'Legends League' },
  { id: 'can-t20', label: 'CAN T20' },
  { id: 'hazare', label: 'Hazare Trophy' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function HomePage() {
  const [activeFilter, setActiveFilter] = useState('live');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDot, setActiveDot] = useState(0);
  const matchCarouselRef = useRef(null);

  useEffect(() => {
    const fetchFilteredMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedMatches = [];
        switch (activeFilter) {
          case 'live':
            fetchedMatches = await fetchLiveMatches();
            break;
          case 'upcoming':
            fetchedMatches = await fetchUpcomingMatches();
            break;
          case 'finished':
          case 'all-matches':
            fetchedMatches = await fetchAllMatches();
            break;
          case 'aus-ind':
            fetchedMatches = await fetchAusIndMatches();
            break;
          case 'legends-league':
            fetchedMatches = await fetchLegendsLeagueMatches();
            break;
          default:
            fetchedMatches = await fetchLiveMatches();
            break;
        }
        setMatches(fetchedMatches || []);
      } catch (err) {
        setError("Failed to fetch matches. Please try again.");
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredMatches();
  }, [activeFilter]);

  const handleScroll = () => {
    if (matchCarouselRef.current) {
      const scrollLeft = matchCarouselRef.current.scrollLeft;
      const cardWidth = matchCarouselRef.current.querySelector('.snap-center').offsetWidth;
      const newActiveDot = Math.floor(scrollLeft / (cardWidth * 3)) % 3;
      setActiveDot(newActiveDot);
    }
  };

  const totalDots = 3;

  const scrollToCard = (dotIndex) => {
    if (matchCarouselRef.current) {
      const cardWidth = matchCarouselRef.current.querySelector('.snap-center').offsetWidth;
      const cardsPerView = 3;
      const scrollPosition = dotIndex * cardsPerView * cardWidth;
      matchCarouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-[50%] relative overflow-y-auto">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-blue-900/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">

          {/* Filter Buttons (Desktop) */}
          <div className="hidden md:flex flex-wrap items-center gap-3 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-[#3f3f3f] shadow-lg'
                    : 'bg-[#e6e6e6] text-[#181a1a] hover:bg-[#a3a3a3] hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Filter Dropdown (Mobile) */}
          <div className="md:hidden flex justify-center mb-8">
            <Menu as="div" className="relative inline-block text-left w-full">
              <div>
                <Menu.Button className="inline-flex w-full justify-between items-center rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600">
                  {filters.find(f => f.id === activeFilter)?.label || 'Select a filter'}
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
                      <Menu.Item key={filter.id}>
                        {({ active }) => (
                          <button
                            onClick={() => setActiveFilter(filter.id)}
                            className={classNames(
                              active ? 'bg-gray-700 text-white' : 'text-gray-300',
                              'block px-4 py-2 text-sm w-full text-left'
                            )}
                          >
                            {filter.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8 flex justify-center">
              <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#f97316"
                ariaLabel="ball-triangle-loading"
                visible={true}
              />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          )}

          {/* Match Cards Container */}
          {!loading && !error && matches.length > 0 && (
            <>
              <div
                ref={matchCarouselRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {matches.map((match, index) => (
                  <div key={match.id || index} className="snap-center flex-shrink-0 w-full md:w-1/3">
                    <MatchCard match={match} />
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalDots }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${
                      activeDot === index ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                    onClick={() => scrollToCard(index)}
                  ></div>
                ))}
              </div>
            </>
          )}

          {/* No matches message */}
          {!loading && !error && matches.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No matches found for the selected category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;