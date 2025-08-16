import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MatchPage from "./pages/MatchPage.jsx";
import StandingsPage from "./pages/StandingsPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import FixturesPage from "./pages/FixturesPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

const CricketPage = () => <div>Cricket Page Content</div>;
const RankingPage = () => <div>Ranking Page Content</div>;
const LiveMatchPage = () => <div>Live Match Page Content</div>;
const ContactPage = () => <div>Contact Page Content</div>;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/match/:id" element={<MatchPage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/cricket" element={<CricketPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/live-match" element={<LiveMatchPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/fixtures" element={<FixturesPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;