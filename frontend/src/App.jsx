import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MatchDetails from "./components/MatchDetails.jsx";
import StandingsPage from "./pages/StandingsPage.jsx";
import TeamPage from "./components/TeamPage.jsx";
import TeamsPages from "./pages/TeamPage.jsx";
import FixturesPage from "./pages/FixturesPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LiveScorePage from "./pages/LiveScorePage.jsx";
import { ErrorBoundary } from "react-error-boundary";
import RankingPage from "./pages/RankingPage.jsx";
const CricketPage = () => <div>Cricket Page Content</div>;
const ContactPage = () => <div>Contact Page Content</div>;

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-red-600">Something Went Wrong</h1>
      <p className="text-gray-700 mt-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/match/:id" element={<MatchDetails />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/team/:id" element={<TeamPage />} />
          <Route path="/cricket" element={<CricketPage />} />
          <Route path="/rankings" element={<RankingPage />} />
          <Route path="/live-scores" element={<LiveScorePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/teams-players" element={<TeamsPages />} />
          <Route path="/fixtures-results" element={<FixturesPage />} />
          <Route path="/news/:id" element={<NewsPage />} />
          {" "}
          {/* Add the new route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
