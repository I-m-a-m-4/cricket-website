import React, { useState, useEffect } from 'react';
import { fetchNews } from '../utils/api';

function InDepthSection() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const newsData = await fetchNews();
                setNews(newsData.slice(0, 3));
            } catch (err) {
                setError("Failed to fetch news data.");
                console.error("Error fetching news:", err);
            } finally {
                setLoading(false);
            }
        };
        getNews();
    }, []);

    if (error) {
        return (
            <section className="bg-gray-100 py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-100 text-gray-800 py-16">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-extrabold text-center mb-12" style={{ fontFamily: "'Open Sans', sans-serif" }}>In Depth</h2>
                
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {news.map((item) => {
                            // Split the description string into sentences to create bullet points
                            const bulletPoints = item.description
                                ? item.description.split('. ').filter(sentence => sentence.trim() !== '')
                                : ['No detailed report available.'];

                            return (
                                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="relative">
                                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-t-lg" />
                                        <div className="absolute bottom-0 left-0 bg-[#D30A11] text-white text-xs font-bold px-3 py-1 rounded-tr-lg">
                                            {item.season?.name || 'Match Report'}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg text-gray-900 mb-4">{item.title}</h3>
                                        <ul className="text-gray-600 text-base space-y-2">
                                            {bulletPoints.map((point, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="h-2 w-2 bg-[#D30A11] rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default InDepthSection;