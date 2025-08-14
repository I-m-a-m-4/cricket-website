import React, { useEffect, useState } from 'react';
import { fetchNews, fetchUpcomingMatches } from '../utils/api';

const MustWatchSection = () => {
  const [selectedView, setSelectedView] = useState('featured');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [newsData, matchesData] = await Promise.all([
          fetchNews(),
          fetchUpcomingMatches()
        ]);
        
        // Find the specific featured article from newsData
        const kumbleArticle = newsData.find(article =>
          article.title.includes('Kumble') || article.title.includes('Moody')
        );
        setContent({
          featured: kumbleArticle || newsData[0],
          indiaMen: matchesData.filter(match => match.gender === 'male').slice(0, 2),
          indiaWomen: matchesData.filter(match => match.gender === 'female').slice(0, 2)
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (!content) return null;

    switch (selectedView) {
      case 'indiaMen':
        return (
          <div className="space-y-4">
            {content.indiaMen.map((match) => (
              <div key={match.id} className="bg-[#1A2E49] p-4 rounded-lg">
                <p className="font-semibold">{match.localteam.name} vs {match.visitorteam.name}</p>
                <p className="text-gray-400 text-sm">{new Date(match.starting_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        );
      case 'indiaWomen':
        return (
          <div className="space-y-4">
            {content.indiaWomen.map((match) => (
              <div key={match.id} className="bg-[#1A2E49] p-4 rounded-lg">
                <p className="font-semibold">{match.localteam.name} vs {match.visitorteam.name}</p>
                <p className="text-gray-400 text-sm">{new Date(match.starting_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        );
      case 'featured':
      default:
        const featuredContent = content.featured;
        return (
          featuredContent ? (
            <>
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold mb-2 pr-4">{featuredContent.title}</h3>
                <a href={featuredContent.link} className="text-[#0D2CDA] font-semibold hover:underline flex-shrink-0">See All</a>
              </div>
              <p className="text-gray-400 text-sm mb-4">{featuredContent.description}</p>
              <div className="relative">
                <img
                  src={featuredContent.image || "https://via.placeholder.com/1200x675"}
                  alt={featuredContent.title}
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-60 rounded-full p-4 cursor-pointer">
                  {/* Play button icon */}
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </div>
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-2 py-1 rounded-full text-xs">
                  04:48
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#1A2E49] border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
              Video content not available
            </div>
          )
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-[#122E47] text-white p-6 rounded-xl max-w-7xl mx-auto my-8">
        <div className="animate-pulse space-y-4">
          {/* ... (loading state JSX remains the same) ... */}
        </div>
      </div>
    );
  }

  return (
    <section className=" text-white p-6 rounded-xl max-w-7xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Must Watch</h2>
        <a href="#" className="text-[#0D2CDA] font-semibold hover:underline">See All</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Navigation */}
        <div className="space-y-3">
          <button onClick={() => setSelectedView('indiaMen')} className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold ${selectedView === 'indiaMen' ? 'bg-[#0D2CDA]' : 'bg-[#1A2E49]'}`}>India men's fixtures</button>
          <button onClick={() => setSelectedView('indiaWomen')} className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold ${selectedView === 'indiaWomen' ? 'bg-[#0D2CDA]' : 'bg-[#1A2E49]'}`}>India women's fixtures</button>
          <button onClick={() => setSelectedView('worldCup')} className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold ${selectedView === 'worldCup' ? 'bg-[#0D2CDA]' : 'bg-[#1A2E49]'}`}>World Cup 2023</button>
          <button onClick={() => setSelectedView('topWicketTakers')} className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold ${selectedView === 'topWicketTakers' ? 'bg-[#0D2CDA]' : 'bg-[#1A2E49]'}`}>WC - Top wicket-takers</button>
          <button onClick={() => setSelectedView('topScorers')} className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold ${selectedView === 'topScorers' ? 'bg-[#0D2CDA]' : 'bg-[#1A2E49]'}`}>WC - Top-scorers</button>
          <button onClick={() => setSelectedView('iccPlayerRankings')} className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold ${selectedView === 'iccPlayerRankings' ? 'bg-[#0D2CDA]' : 'bg-[#1A2E49]'}`}>ICC player rankings</button>
          <button onClick={() => setSelectedView('iccTeamRankings')} className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold ${selectedView === 'iccTeamRankings' ? 'bg-[#0D2CDA]' : 'bg-[#1A2E49]'}`}>ICC team rankings</button>
          <button onClick={() => setSelectedView('30years')} className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold ${selectedView === '30years' ? 'bg-[#0D2CDA]' : 'bg-[#1A2E49]'}`}>30 years of ESPNcricinfo</button>
        </div>
        
        {/* Right Column - Dynamic Content */}
        <div className="md:col-span-2">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default MustWatchSection;