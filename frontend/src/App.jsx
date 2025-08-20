import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LiveScorePage from './pages/LiveScorePage';
import FixturesPage from './pages/FixturesPage';
import RankingPage from './pages/RankingPage';
import TeamPage from './pages/TeamPage';
import NewsPage from './pages/NewsPage';
import StadiumPage from './pages/StadiumPage';
import StadiumDetailPage from './pages/StadiumDetailPage';
import MatchPage from './pages/MatchPage';
import NotFoundPage from './pages/NotFoundPage';
import StandingsPage from './pages/StandingsPage';
import Breadcrumbs from './components/Breadcrumbs';
import SeriesPage from './pages/SeriesPage';
import SeriesListPage from './pages/SeriesListPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Breadcrumbs />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/live-scores" element={<LiveScorePage />} />
              <Route path="/fixtures-results" element={<FixturesPage />} />
              <Route path="/rankings" element={<RankingPage />} />
              <Route path="/teams-players" element={<TeamPage />} />
              <Route path="/news-highlights" element={<NewsPage />} />
              <Route path="/stadiums" element={<StadiumPage />} />
              <Route path="/stadium/:id" element={<StadiumDetailPage />} />
              <Route path="/match/:id" element={<MatchPage />} />
              <Route path="/standings/:seasonId" element={<StandingsPage />} />
              <Route path="/series" element={<SeriesListPage />} />
              <Route path="/series/:id" element={<SeriesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;