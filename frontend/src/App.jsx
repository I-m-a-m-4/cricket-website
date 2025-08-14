import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MatchPage from "./pages/MatchPage.jsx";
import StandingsPage from "./pages/StandingsPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import InDepthSection from "./components/InDepthSection.jsx";
import MustWatchSection from "./components/MustWatchSection.jsx";
import LatestNewsSection from "./components/LatestNewsSection.jsx";
import MatchesSection from "./components/MatchesSection.jsx";
import KeySeriesSection from "./components/KeySeriesSection.jsx";
import VideosSection from "./components/VideoSection.jsx";
import TrendingPlayers from "./components/TrendingPlayers.jsx";
import RankingsSection from "./components/RankingSection.jsx";
import FixturePage from "./pages/FixturePage.jsx";
// Placeholder components for missing pages
const CricketPage = () => <div>Cricket Page Content</div>;
const RankingPage = () => <div>Ranking Page Content</div>;
const LiveMatchPage = () => <div>Live Match Page Content</div>;
const ContactPage = () => <div>Contact Page Content</div>;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/match/:id" element={<MatchPage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/cricket" element={<CricketPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/live-match" element={<LiveMatchPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/fixtures" element={<FixturePage />} /> {/* New route */}
      </Routes>
      <MustWatchSection />
      <MatchesSection />
      <RankingsSection />
      <TrendingPlayers />
      <VideosSection />
      <KeySeriesSection />
      <LatestNewsSection />
      <InDepthSection />
      <Footer />
    </BrowserRouter>
  );
}

export default App;