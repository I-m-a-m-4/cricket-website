import React, { useEffect, useState } from 'react';
import { PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock API functions with different videos for each category
const fetchNews = async () => [];
const fetchUpcomingMatches = async () => [
  { id: 1, localteam: { name: 'India' }, visitorteam: { name: 'Australia' }, starting_at: '2025-08-20', gender: 'male' },
  { id: 2, localteam: { name: 'India' }, visitorteam: { name: 'England' }, starting_at: '2025-08-25', gender: 'male' },
  { id: 3, localteam: { name: 'India' }, visitorteam: { name: 'South Africa' }, starting_at: '2025-08-22', gender: 'female' },
  { id: 4, localteam: { name: 'India' }, visitorteam: { name: 'New Zealand' }, starting_at: '2025-08-27', gender: 'female' }
];

const fetchVideosByCategory = async (category) => {
  const videoCategories = {
    featured: [
      { id: 'dQw4w9WgXcQ', title: 'What will Kumble and Moody remember the World Cup for?', channelTitle: 'ESPNcricinfo', description: "Shami's wicket-taking spree, Afghanistan making a statement, and more" },
      { id: 'ScMzIvxBSi4', title: 'World Cup 2023 Highlights', channelTitle: 'Cricket Official', description: 'Best moments from the tournament' }
    ],
    indiaMen: [
      { id: 'M7lc1UVf-VE', title: "India Men's Team Training Session", channelTitle: 'BCCI', description: 'Exclusive behind-the-scenes footage' },
      { id: 'kJQP7kiw5Fk', title: 'Kohli Century Compilation', channelTitle: 'Cricket Highlights', description: 'Best centuries by Virat Kohli' }
    ],
    indiaWomen: [
      { id: 'ZbZSe6N_BXs', title: "India Women's Cricket Journey", channelTitle: 'BCCI Women', description: 'Rise of women cricket in India' },
      { id: 'A_MjCqQoLLA', title: 'Smriti Mandhana Best Shots', channelTitle: 'Women Cricket', description: 'Beautiful strokes compilation' }
    ],
    worldCup: [
      { id: 'fJ9rUzIMcZQ', title: 'World Cup 2023 Final Highlights', channelTitle: 'ICC', description: 'The thrilling final match' },
      { id: 'QH2-TGUlwu4', title: 'World Cup Best Catches', channelTitle: 'Cricket World', description: 'Spectacular catches from the tournament' }
    ],
    topWicketTakers: [
      { id: 'DLzxrzFCyOs', title: 'Top Wicket Takers Analysis', channelTitle: 'Cricket Stats', description: 'Statistical breakdown of leading bowlers' },
      { id: 'TcMBFSGVi1c', title: 'Best Bowling Figures WC 2023', channelTitle: 'ESPN Cricinfo', description: 'Outstanding bowling performances' }
    ],
    topScorers: [
      { id: 'SQoA_wjmE9w', title: 'Highest Run Scorers WC 2023', channelTitle: 'Cricket Analysis', description: 'Top batsmen of the tournament' },
      { id: 'XgYu7-DQjDQ', title: 'Century Makers Compilation', channelTitle: 'ICC Highlights', description: 'All centuries from World Cup 2023' }
    ],
    askCricinfo: [
      { id: 'RgKAFK5djSk', title: 'Ask Cricinfo: Rules Explained', channelTitle: 'ESPN Cricinfo', description: 'Cricket rules and regulations explained' },
      { id: 'wJWksPWDKOc', title: 'Cricket Trivia with Experts', channelTitle: 'Cricinfo Plus', description: 'Fun cricket facts and trivia' }
    ],
    iccPlayerRankings: [
      { id: 'L_jWHffIx5E', title: 'ICC Player Rankings Update', channelTitle: 'ICC Official', description: 'Latest player rankings analysis' },
      { id: 'OPf0YbXqDm0', title: 'Top Ranked Players Discussion', channelTitle: 'Cricket Today', description: 'Expert discussion on current rankings' }
    ],
    iccTeamRankings: [
      { id: 'eVTXPUF4Oz4', title: 'ICC Team Rankings Breakdown', channelTitle: 'ICC', description: 'Current team standings explained' },
      { id: 'KmtzQCSh6xg', title: 'Team Rankings History', channelTitle: 'Cricket Archive', description: 'Evolution of team rankings over time' }
    ],
    '30years': [
      { id: 'iik25wqIuFo', title: '30 Years of ESPNcricinfo Journey', channelTitle: 'ESPN Cricinfo', description: 'Celebrating three decades of cricket coverage' },
      { id: 'ZhfUv0spHCY', title: 'Cricket Evolution - 30 Years', channelTitle: 'Cricinfo Legacy', description: 'How cricket changed over 30 years' }
    ]
  };
  
  return videoCategories[category] || videoCategories.featured;
};

const LoadingSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-6xl mx-auto p-4 sm:p-6 my-8 animate-pulse" style={{ fontFamily: 'Open Sans, sans-serif' }}>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
      <div className="h-6 bg-gray-300 rounded w-48"></div>
      <div className="h-4 bg-gray-300 rounded w-20"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      {/* Left Column - Navigation Skeleton */}
      <div className="space-y-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-300 rounded"></div>
        ))}
      </div>
      {/* Right Column - Content Skeleton */}
      <div className="lg:col-span-3">
        <div className="bg-gray-200 p-4 rounded-xl space-y-4">
          <div className="h-6 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="w-full aspect-video bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

const MustWatchSection = () => {
  const [selectedView, setSelectedView] = useState('featured');
  const [content, setContent] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [newsData, matchesData, videosData] = await Promise.all([
          fetchNews(),
          fetchUpcomingMatches(),
          fetchVideosByCategory('featured'),
        ]);

        setContent({
          news: newsData,
          indiaMen: matchesData.filter(match => match.gender === 'male').slice(0, 2),
          indiaWomen: matchesData.filter(match => match.gender === 'female').slice(0, 2)
        });
        setVideos(videosData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load different videos when filter changes
  useEffect(() => {
    const loadVideosForCategory = async () => {
      try {
        const categoryVideos = await fetchVideosByCategory(selectedView);
        setVideos(categoryVideos);
        setCurrentVideoIndex(0); // Reset to first video when changing category
      } catch (error) {
        console.error("Error fetching category videos:", error);
      }
    };

    loadVideosForCategory();
  }, [selectedView]);

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const renderContent = () => {
    if (!content && selectedView !== 'featured') return null;
    
    switch (selectedView) {
      case 'indiaMen':
        return (
          <div className="space-y-4">
            {content.indiaMen.map((match) => (
              <div key={match.id} className="bg-gray-50 border p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{match.localteam.name} vs {match.visitorteam.name}</p>
                <p className="text-gray-600 text-sm">{new Date(match.starting_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        );
      case 'indiaWomen':
        return (
          <div className="space-y-4">
            {content.indiaWomen.map((match) => (
              <div key={match.id} className="bg-gray-50 border p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{match.localteam.name} vs {match.visitorteam.name}</p>
                <p className="text-gray-600 text-sm">{new Date(match.starting_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        );
      default:
        const currentVideo = videos[currentVideoIndex];
        return (
          <div className="space-y-4">
            {/* Video Title and Description Above Video */}
            {currentVideo && (
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-black leading-tight">
                  {currentVideo.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentVideo.description}
                </p>
              </div>
            )}
            
            {/* Video Player */}
            {currentVideo ? (
              <div className="relative overflow-hidden w-full rounded-lg shadow-sm bg-black">
                <iframe
                  className="w-full aspect-video rounded-lg"
                  src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=0&controls=1&showinfo=0&rel=0`}
                  title={currentVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                {/* Navigation Arrows */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between pointer-events-none p-4">
                  {videos.length > 1 && (
                    <>
                      <button 
                        onClick={handlePrevVideo} 
                        className="p-2 rounded-full bg-black bg-opacity-60 text-white hover:bg-opacity-80 transition-all pointer-events-auto opacity-0 hover:opacity-100 focus:opacity-100"
                        aria-label="Previous video"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={handleNextVideo} 
                        className="p-2 rounded-full bg-black bg-opacity-60 text-white hover:bg-opacity-80 transition-all pointer-events-auto opacity-0 hover:opacity-100 focus:opacity-100"
                        aria-label="Next video"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Video Duration Badge */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  04:48
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
                Video content not available
              </div>
            )}
          </div>
        );
    }
  };

  const menuItems = [
    { key: 'india-mens', label: "India men's fixtures", view: 'indiaMen' },
    { key: 'india-womens', label: "India women's fixtures", view: 'indiaWomen' },
    { key: 'world-cup', label: 'World Cup 2023', view: 'worldCup' },
    { key: 'wicket-takers', label: 'WC - Top wicket-takers', view: 'topWicketTakers' },
    { key: 'top-scorers', label: 'WC - Top-scorers', view: 'topScorers' },
    { key: 'ask-cricinfo', label: 'Ask Cricinfo', view: 'askCricinfo' },
    { key: 'icc-player', label: 'ICC player rankings', view: 'iccPlayerRankings' },
    { key: 'icc-team', label: 'ICC team rankings', view: 'iccTeamRankings' },
    { key: '30-years', label: '30 years of ESPNcricinfo', view: '30years' }
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex justify-center px-4 my-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      <section className="bg-white  rounded-xl  max-w-6xl w-full p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Must Watch</h2>
          <a href="#" className="text-red-600 font-semibold hover:text-red-700 transition-colors text-sm">
            See All
          </a>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {/* Left Column - Navigation */}
          <div className="space-y-1 lg:self-start">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedView(item.view)}
                className={`w-full text-left px-3 py-2.5 rounded text-sm font-bold transition-all duration-200 shadow-sm ${
                  selectedView === item.view
                    ? 'bg-gray-200 text-black shadow-md'
                    : 'text-black hover:bg-gray-100 hover:shadow-md bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Right Column - Dynamic Content */}
          <div className="lg:col-span-3 lg:self-start">
            <div className="bg-white">
              {renderContent()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MustWatchSection;