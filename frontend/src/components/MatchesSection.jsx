import React, { useState, useEffect, useRef } from 'react';
import { fetchUpcomingMatches, fetchPastMatches, fetchLiveMatches } from '../utils/api';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const filters = [
  { id: 'upcoming', label: 'Upcoming Matches' },
  { id: 'finished', label: 'Finished Matches' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function MatchesSection({ limit = 6 }) {
  const [matches, setMatches] = useState([]);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const matchCarouselRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;
        switch (activeFilter) {
          case 'live':
            data = await fetchLiveMatches();
            break;
          case 'finished':
            data = await fetchPastMatches();
            break;
          case 'upcoming':
          default:
            data = await fetchUpcomingMatches();
            break;
        }
        if (!isMounted) return;

        if (data && Array.isArray(data) && data.length > 0) {
          setMatches(data.slice(0, limit));
        } else {
          setMatches([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Fetch error:', err);
        setError('Failed to load matches.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    loadMatches();
    return () => { isMounted = false; };
  }, [activeFilter, limit]);

  const handleScroll = () => {
    if (matchCarouselRef.current) {
      const scrollLeft = matchCarouselRef.current.scrollLeft;
      const cardWidth = matchCarouselRef.current.querySelector('.snap-center')?.offsetWidth || 350;
      const newActiveDot = Math.floor(scrollLeft / (cardWidth * 3)) % 2;
      setActiveDot(newActiveDot);
    }
  };

  const totalDots = 2;

  const scrollToCard = (dotIndex) => {
    if (matchCarouselRef.current) {
      const cardWidth = matchCarouselRef.current.querySelector('.snap-center')?.offsetWidth || 350;
      const cardsPerView = 3;
      const scrollPosition = dotIndex * cardsPerView * cardWidth;
      matchCarouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  if (error) return <div className="text-center py-8 text-red-600 font-semibold">{error}</div>;

  if (matches.length === 0 && !loading) {
    return <div className="text-center py-8 text-gray-500 font-medium">No matches available at the moment.</div>;
  }

  const displayedMatches = matches;

  return (
    <section className="bg-gradient-to-b from-gray-100 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <h2 className="text-3xl font-bold text-gray-800">Matches</h2>
            <div className="hidden md:flex space-x-4">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeFilter === filter.id
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="md:hidden">
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="inline-flex justify-between items-center px-6 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors">
                  {filters.find((f) => f.id === activeFilter)?.label || 'Select Filter'}
                  <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {filters.map((filter) => (
                        <Menu.Item key={filter.id}>
                          {({ active }) => (
                            <button
                              onClick={() => setActiveFilter(filter.id)}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full text-left'
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
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-red-600 font-semibold hover:text-red-800 transition-colors"
          >
            {showAll ? 'See Less' : 'See All'}
          </button>
        </div>
    <div
  ref={matchCarouselRef}
  onScroll={handleScroll}
  className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
>
  {loading
    ? [...Array(3)].map((_, index) => (
        <div
          key={index}
          className="snap-center flex-shrink-0 w-80 md:w-96 lg:w-1/3 bg-white p-4 rounded-xl shadow-lg animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="w-16 h-5 bg-gray-300 rounded"></div>
            <div className="w-24 h-5 bg-gray-300 rounded"></div>
          </div>
          <div className="flex justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-20 h-5 bg-gray-300 rounded"></div>
            </div>
            <div className="w-12 h-12 bg-gray-300 rounded"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-20 h-5 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="w-28 h-5 bg-gray-300 rounded mb-2"></div>
          <div className="w-24 h-5 bg-gray-300 rounded"></div>
        </div>
      ))
    : displayedMatches.map((match) => (
        <div
          key={match.id}
          className="snap-center flex-shrink-0 w-80 md:w-96 lg:w-1/3 max-w-lg bg-gradient-to-br from-white to-gray-50 p-4 md:p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
          {/* Match Type & League */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-red-600 font-semibold text-xs md:text-sm uppercase truncate">
              {activeFilter === 'upcoming' ? 'Fixture' : activeFilter === 'live' ? 'Live' : 'Result'}
            </span>
            <span className="text-gray-500 text-xs md:text-sm truncate flex-1 text-right ml-2">
              {match.league?.name || 'League Name'}
            </span>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-3 space-x-2">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <img
                src={match.localteam?.image_path || 'https://via.placeholder.com/40'}
                alt={match.localteam?.name || 'Team A'}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
              />
              <span className="text-gray-900 font-semibold text-sm md:text-base truncate">
                {match.localteam?.name || 'Team A'}
              </span>
            </div>

            <img
              src="/vs.png"
              alt="vs"
              className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1 flex-shrink-0 z-10"
              style={{ minWidth: '2rem' }}
            />

            <div className="flex items-center space-x-2 min-w-0 flex-1 justify-end">
              <span className="text-gray-900 font-semibold text-sm md:text-base truncate text-right">
                {match.visitorteam?.name || 'Team B'}
              </span>
              <img
                src={match.visitorteam?.image_path || 'https://via.placeholder.com/40'}
                alt={match.visitorteam?.name || 'Team B'}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="text-gray-600 text-xs md:text-sm mb-2 truncate">
            {match.starting_at
              ? new Date(match.starting_at).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  timeZone: 'Asia/Kolkata',
                })
              : 'Date TBD'}
          </div>

          {/* Final Score (only for finished) */}
          {activeFilter === 'finished' && (
            <div className="flex justify-between text-gray-800 font-medium text-sm mb-2">
              <span>
                {getScoreFromNote(match).localScore} ({match.localteam?.name?.slice(0, 8) + '...' || 'A'})
              </span>
              <span>
                {getScoreFromNote(match).visitorScore} ({match.visitorteam?.name?.slice(0, 8) + '...' || 'B'})
              </span>
            </div>
          )}

          {/* Status */}
          <div className="text-gray-500 text-xs md:text-sm mb-3 line-clamp-1">
            {getMatchStatus(match)}
          </div>

          {/* Link */}
          <a
            href={`/match/${match.id}`}
            className="text-red-600 font-semibold text-xs md:text-sm hover:text-red-800 transition-colors block text-center"
          >
            Match Info →
          </a>
        </div>
      ))}
</div>
      </div>
    </section>
  );
}

function getMatchStatus(match) {
  const now = new Date();
  const matchDate = new Date(match.starting_at);
  if (match.status === 'Finished' || match.status === 'Aban.') return match.note || 'Completed';
  const diffDays = Math.ceil((matchDate - now) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays} days To go` : 'Live';
}

function getScoreFromNote(match) {
  if (!match.note) return { localScore: 'N/A', visitorScore: 'N/A' };
  const [localScore, visitorScore] = match.note.split(' won by ').length > 1
    ? [match.winner_team_id === match.localteam_id ? 'W' : 'L', match.winner_team_id === match.visitorteam_id ? 'W' : 'L']
    : ['N/A', 'N/A'];
  return { localScore, visitorScore };
}
export default MatchesSection;