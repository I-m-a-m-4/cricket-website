import React, { useEffect, useState } from 'react';
import { PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const LoadingSkeleton = () => (
  <div className="bg-gray-100 border border-gray-200 rounded-xl shadow-lg max-w-6xl mx-auto p-4 sm:p-6 my-8 animate-pulse" style={{ fontFamily: 'Open Sans, sans-serif' }}>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
      <div className="h-6 bg-gray-300 rounded w-48"></div>
      <div className="h-4 bg-gray-300 rounded w-20"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      <div className="space-y-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-300 rounded"></div>
        ))}
      </div>
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

  // Hardcoded video data with YouTube embed URLs
  const hardcodedVideos = {
    featured: [
      {
        embedUrl: 'https://www.youtube.com/embed/bbI1SxikmFI',
        title: 'What will Kumble and Moody remember the World Cup for?',
        channelTitle: 'ESPNcricinfo',
        description: "Shami's wicket-taking spree, Afghanistan making a statement, and more",
      },
      {
        embedUrl: 'https://www.youtube.com/embed/YqKYpgZ9FWU',
        title: 'World Cup 2023 Highlights',
        channelTitle: 'Cricket Official',
        description: 'Best moments from the tournament',
      },
    ],
    indiaMen: [
      {
        embedUrl: 'https://www.youtube.com/embed/AYSL-kGbUMU',
        title: "India Men's Team Training Session",
        channelTitle: 'BCCI',
        description: 'Exclusive behind-the-scenes footage',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/X1M6ak4-alM',
        title: 'Kohli Century Compilation',
        channelTitle: 'Cricket Highlights',
        description: 'Best centuries by Virat Kohli',
      },
    ],
    indiaWomen: [
      {
        embedUrl: 'https://www.youtube.com/embed/rG1BuEuGYzI?si=RbeRNd28-jVFW2Qz',
        title: "India Women's Cricket Journey",
        channelTitle: 'BCCI Women',
        description: 'Rise of women cricket in India',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/TxXwlMfmNQc?si=SgeIxv-Th6sxfAnH',
        title: 'Smriti Mandhana Best Shots',
        channelTitle: 'Women Cricket',
        description: 'Beautiful strokes compilation',
      },
    ],
    worldCup: [
      {
        embedUrl: 'https://www.youtube.com/embed/V2O8S4cwwO8?si=tfh89LF-sXgp8WVQ',
        title: 'World Cup 2023 Final Highlights',
        channelTitle: 'ICC',
        description: 'The thrilling final match',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/nHFWwCsskwk',
        title: 'World Cup Best Catches',
        channelTitle: 'Cricket World',
        description: 'Spectacular catches from the tournament',
      },
    ],
    topWicketTakers: [
      {
        embedUrl: 'https://www.youtube.com/embed/PUf5Hq6f0Y4?si=Vw-ey8op4axZofvY',
        title: 'Top Wicket Takers Analysis',
        channelTitle: 'Cricket Stats',
        description: 'Statistical breakdown of leading bowlers',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/0j2CV-__V48',
        title: 'Best Bowling Figures WC 2023',
        channelTitle: 'ESPN Cricinfo',
        description: 'Outstanding bowling performances',
      },
    ],
    topScorers: [
      {
        embedUrl: 'https://www.youtube.com/embed/pFbBUcR7GGg',
        title: 'Highest Run Scorers WC 2019',
        channelTitle: 'Cricket Analysis',
        description: 'Top batsmen of the tournament',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/Gvw8xtvlZ5w',
        title: 'Century Makers Compilation',
        channelTitle: 'ICC Highlights',
        description: 'All centuries from World Cup 2023',
      },
    ],
    askCricinfo: [
      {
        embedUrl: 'https://www.youtube.com/embed/SUipHDbAB5I',
        title: 'Ask Cricinfo: Rules Explained',
        channelTitle: 'ESPN Cricinfo',
        description: 'Cricket rules and regulations explained',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/oua9fcm8uhY',
        title: 'Cricket Trivia with Experts',
        channelTitle: 'Cricinfo Plus',
        description: 'Fun cricket facts and trivia',
      },
    ],
    iccPlayerRankings: [
      {
        embedUrl: 'https://www.youtube.com/embed/4k6HFA5NuHI',
        title: 'ICC Player Rankings Update',
        channelTitle: 'ICC Official',
        description: 'Latest player rankings analysis',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/VbwfPqfkkMM',
        title: 'Top Ranked Players Discussion',
        channelTitle: 'Cricket Today',
        description: 'Expert discussion on current rankings',
      },
    ],
    iccTeamRankings: [
      {
        embedUrl: 'https://www.youtube.com/embed/kjQBq9PyaiA',
        title: 'ICC Team Rankings Breakdown',
        channelTitle: 'ICC',
        description: 'Current team standings explained',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/TQ5couH3DWo',
        title: 'Team Rankings History',
        channelTitle: 'Cricket Archive',
        description: 'Evolution of team rankings over time',
      },
    ],
    '30years': [
      {
        embedUrl: 'https://www.youtube.com/embed/khfBUG7ntpw',
        title: '30 Years of ESPNcricinfo Journey',
        channelTitle: 'ESPN Cricinfo',
        description: 'Celebrating three decades of cricket coverage',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/sx01uJWKnz4',
        title: 'Cricket Evolution - 30 Years',
        channelTitle: 'Cricinfo Legacy',
        description: 'How cricket changed over 30 years',
      },
    ],
  };

  // Mock API functions (no fixtures needed)
  const fetchNews = async () => [];
  const fetchUpcomingMatches = async () => []; // Removed all fixtures

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [newsData, matchesData] = await Promise.all([
          fetchNews(),
          fetchUpcomingMatches(),
        ]);

        setContent({
          news: newsData,
          indiaMen: [], // No fixtures, only videos
          indiaWomen: [], // No fixtures or videos
        });
        setVideos(hardcodedVideos.featured); // Default to featured videos
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setVideos(hardcodedVideos[selectedView] || []); // Update videos based on selected view, no fallback
    setCurrentVideoIndex(0); // Reset to first video
  }, [selectedView]);

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const renderContent = () => {
    const currentVideo = videos[currentVideoIndex];
    if (!currentVideo) return null; // No fallback, just return null if no video
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-black leading-tight">
            {currentVideo.title}
          </h3>
          <p className="text-sm text-gray-600">
            {currentVideo.description}
          </p>
        </div>
        <div className="relative overflow-hidden w-full rounded-lg shadow-sm bg-black">
          <iframe
            className="w-full aspect-video rounded-lg"
            src={currentVideo.embedUrl + '?autoplay=0&controls=1&showinfo=0&rel=0'}
            title={currentVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
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
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            04:48
          </div>
        </div>
      </div>
    );
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
    { key: '30-years', label: '30 years of ESPNcricinfo', view: '30years' },
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex justify-center px-4 my-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      <section className="bg-white rounded-xl max-w-6xl w-full p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Must Watch</h2>
          
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <div className="space-y-1 lg:self-start">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedView(item.view)}
                className={`w-full text-left px-3 py-2.5 rounded text-sm font-bold transition-all duration-200 shadow-sm ${
                  selectedView === item.view
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-black hover:bg-gray-100 hover:shadow-md bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
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