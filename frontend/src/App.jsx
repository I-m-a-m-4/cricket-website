import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LiveScorePage from './pages/LiveScorePage';
import FixturesPage from './pages/FixturesPage';
import RankingPage from './pages/RankingPage';
import TeamPage from './pages/TeamPage';
import TeamPageDetails from './components/TeamPageDetails';
import NewsPage from './pages/NewsPage';
import StadiumPage from './pages/StadiumPage';
import StadiumDetailPage from './pages/StadiumDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import StandingsPage from './pages/StandingsPage';
import SeriesPage from './pages/SeriesPage';
import SeriesListPage from './pages/SeriesListPage';
import { ThemeProvider } from './context/ThemeContext';
import MatchDetails from './components/MatchDetails';
import Stats from './pages/Stats';
import SeriesFixturesPage from './pages/SeriesFixturesPage';
import SeriesSquadsPage from './pages/SeriesSquadsPage';
import SeriesStandingsPage from './pages/SeriesStandingsPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/live-scores" element={<LiveScorePage />} />
              <Route path="/fixtures-results" element={<FixturesPage />} />
              <Route path="/rankings" element={<RankingPage />} />
              <Route path="/teams-players" element={<TeamPage />} />
              <Route path="/teams/:id" element={<TeamPageDetails />} />
              <Route path="/news-highlights" element={<NewsPage />} />
              <Route path="/stadiums" element={<StadiumPage />} />
              <Route path="/stadium/:id" element={<StadiumDetailPage />} />
              <Route path="/match/:id" element={<MatchDetails />} />
              <Route path="/standings/:seasonId" element={<StandingsPage />} />
              <Route path="/series" element={<SeriesListPage />} />
              <Route path="/series/:id" element={<SeriesPage />} />
              <Route path="/series/:seasonId/fixtures" element={<SeriesFixturesPage />} />
              <Route path="/series/:seasonId/squads" element={<SeriesSquadsPage />} />
              <Route path="/series/:seasonId/standings" element={<SeriesStandingsPage />} />
              <Route path="/stats/*" element={<Stats />} />
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