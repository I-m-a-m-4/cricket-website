// src/pages/LiveScorePage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  fetchLiveMatches,
  fetchRecentMatches,
  fetchUpcomingMatches,
} from "../utils/api"; // guaranteed helpers; optional helpers loaded dynamically

/* ================== CONFIG & HELPERS ================== */
const LEAGUE_LOGOS = {
  "The Hundred": "/th.png",
  "The Women's Hundred": "/thw.jpeg",
  IPL: "/TL.png",
  "Big Bash League": "/bb.jpg",
  "The Ashes": "/rw.png",
  "ICC World Cup": "/icc.jpg",
  PSL: "/rw.png",
  "Test Series": "/test.jpg",
  "Super Smash": "/ss.png",
  "Royal London One-Day Cup": "/rw.jpg",
  "T20 Blast": "/t20.jpg",
  CPL: "/cpl.png",
  default: "/icc.jpg",
};

const safeGet = (v, fallback = "") => (v === undefined || v === null ? fallback : v);

const formatOvers = (overs) => {
  if (overs === null || overs === undefined) return "—";
  const full = Math.floor(overs);
  const balls = Math.round((overs - full) * 10);
  return `${full}.${balls}`;
};
const formatScore = (score, wickets, overs) => {
  if (score === null || score === undefined) return "—";
  if (wickets === null || wickets === undefined) return `${score}/—`;
  if (overs === null || overs === undefined) return `${score}/${wickets}`;
  return `${score}/${wickets} (${formatOvers(overs)})`;
};
const rr = (score, overs) => {
  if (!score || !overs) return "—";
  return (score / overs).toFixed(2);
};
const teamInfo = (team) => ({
  name: team?.name || "Unknown",
  flag: team?.image_path || team?.image || team?.logo_path || null, // null if absent
});
const leagueLogo = (leagueName) => LEAGUE_LOGOS[leagueName] || LEAGUE_LOGOS.default;
const lastBallEvent = (ballsData) => {
  if (!Array.isArray(ballsData) || ballsData.length === 0) return null;
  const lastBall = ballsData[ballsData.length - 1];
  const out = [];
  if (lastBall.batsmanout) out.push("WICKET ⚰️");
  else if (lastBall.score?.run === 6) out.push("SIX 🎉");
  else if (lastBall.score?.run === 4) out.push("FOUR 🏏");
  else if (lastBall.score?.run > 0) out.push(`${lastBall.score.run} runs`);
  else out.push("Dot ball");
  return { text: out.join(", "), over: `${lastBall.over_number}.${lastBall.ball_number}` };
};

/* ================== CONSTANTS ================== */
const TAB_KEYS = [
  { key: "live", label: "Live Cricket Score" },
  { key: "schedule", label: "Cricket Schedule" },
  { key: "results", label: "Match Results" },
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CHIP_FILTERS = [
  { id: "intl", label: "Int’l" },
  { id: "t20", label: "T20s" },
  { id: "odi", label: "ODIs" },
  { id: "tests", label: "Tests" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "domestic", label: "Domestic" },
  { id: "fc", label: "FC" },
  { id: "youth", label: "Youth" },
  { id: "listA", label: "List A" },
  { id: "others", label: "Others" },
];

/* ================== MAIN COMPONENT ================== */
export default function LiveScorePage() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [trendingVenues, setTrendingVenues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // read ?tab= from URL
  useEffect(() => {
    const params = new URLSearchParams(location?.search || "");
    const tab = params.get("tab");
    if (tab && TAB_KEYS.some((t) => t.key === tab)) setActiveTab(tab);
  }, [location]);

  // Load data. dynamic imports for optional helpers
  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const apiModule = await import("../utils/api").catch(() => ({}));
        const optionalFetchTopPlayers = apiModule.fetchTopPlayers;
        const optionalFetchTopHeadlines = apiModule.fetchTopHeadlines;
        const optionalFetchTrendingNews = apiModule.fetchTrendingNews;

        const pLive = fetchLiveMatches?.().catch((e) => { console.warn(e); return []; });
        const pRecent = fetchRecentMatches?.().catch((e) => { console.warn(e); return []; });
        const pUpcoming = fetchUpcomingMatches?.().catch((e) => { console.warn(e); return []; });
        const pPlayers = optionalFetchTopPlayers?.().catch((e) => { console.warn(e); return []; });
        const pHeadlines = optionalFetchTopHeadlines?.().catch((e) => { console.warn(e); return []; });
        const pTrending = optionalFetchTrendingNews?.().catch((e) => { console.warn(e); return []; });

        const [live, recent, upcoming, players, headlines, trending] = await Promise.all([
          pLive, pRecent, pUpcoming, pPlayers, pHeadlines, pTrending,
        ]);

        if (!mounted) return;

        setLiveMatches(Array.isArray(live) ? live : []);
        setRecentMatches(Array.isArray(recent) ? recent : []);
        setUpcomingMatches(Array.isArray(upcoming) ? upcoming : []);
        setTopPlayers(Array.isArray(players) ? players : []);
        const news = Array.isArray(headlines) && headlines.length ? headlines : (Array.isArray(trending) ? trending : []);
        setTrendingNews(news);

        // simple trending venues fallback
        setTrendingVenues((Array.isArray(recent) ? recent : []).slice(0, 6).map((m) => ({
          id: m?.venue?.id,
          name: m?.venue?.name,
          image: m?.venue?.image_path || null, // null if absent -> won't render
        })));
      } catch (err) {
        console.error("loadAll error:", err);
        setErrorMsg("Some content couldn't be loaded from the backend; showing available fallbacks.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAll();
    const id = setInterval(loadAll, 300000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // Group by series/league
  const groupBySeries = (matches = []) => {
    const map = new Map();
    (matches || []).forEach((m) => {
      if (!m) return;
      const series = safeGet(m.league?.name) || safeGet(m.stage?.name) || "Other";
      if (!map.has(series)) map.set(series, []);
      map.get(series).push(m);
    });
    return Array.from(map.entries()).map(([series, list]) => ({ series, list }));
  };

  const groupedLive = useMemo(() => groupBySeries(liveMatches), [liveMatches]);
  const groupedResults = useMemo(() => groupBySeries(recentMatches), [recentMatches]);
  const groupedUpcoming = useMemo(() => groupBySeries(upcomingMatches), [upcomingMatches]);

  // Filtering helpers (applies immediately)
  const getMatchType = (m) => {
    const candidates = [m.type, m.round, m.league?.format, m.league?.type, m.stage?.name].filter(Boolean);
    return candidates.join(" ").toLowerCase();
  };
  const getMatchGender = (m) => (m.gender || m.league?.gender || "").toLowerCase();
  const getLeagueNameLower = (m) => (m.league?.name || "").toLowerCase();

  const applyChipFilters = (matches = []) => {
    if (!Array.isArray(matches)) return [];
    if (activeFilters.length === 0) return matches;
    return matches.filter((m) => {
      if (!m) return false;
      const type = getMatchType(m);
      const league = getLeagueNameLower(m);
      const gender = getMatchGender(m) || "men";
      const isIntl = league.includes("world") || league.includes("icc") || league.includes("international");
      const isDomestic = !isIntl;
      return activeFilters.every((f) => {
        switch (f) {
          case "t20": return type.includes("t20");
          case "odi": return type.includes("odi");
          case "tests": return type.includes("test");
          case "intl": return isIntl;
          case "domestic": return isDomestic;
          case "men": return gender === "men";
          case "women": return gender === "women";
          case "fc": return type.includes("fc") || type.includes("first");
          case "youth": return league.includes("u19") || league.includes("youth");
          case "listA": return type.includes("list a") || type.includes("list-a");
          case "others": return !(type.includes("t20") || type.includes("odi") || type.includes("test"));
          default: return true;
        }
      });
    });
  };

  // Fallback player list from recent fixtures if topPlayers unavailable
  const fallbackPlayersFromRecent = useMemo(() => {
    const players = [];
    (recentMatches || []).forEach((m) => {
      const mop = m.man_of_match || m.manofmatch || m.man_of_the_match;
      if (mop) {
        const name = mop?.name || mop;
        if (name && !players.find((p) => p.name === name)) players.push({ id: `mop-${name}`, name, image: null, team: m.localteam?.name || m.visitorteam?.name });
      }
      (m.lineup || []).forEach((pl) => {
        const pname = pl?.fullname || pl?.name;
        if (pname && !players.find((p) => p.name === pname)) players.push({ id: pl.id || `pl-${pname}`, name: pname, image: pl.image_path || null, team: pl.team?.name || "" });
      });
    });
    return players.slice(0, 8);
  }, [recentMatches]);

  /* ================== UI SUBCOMPONENTS ================== */

  // Breadcrumbs with '>' separator and bold active segment
  const Breadcrumbs = () => {
    const { pathname } = location;
    const parts = pathname.split("/").filter(Boolean);
    return (
      <nav className="text-sm text-gray-600 mb-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          {parts.map((p, i) => {
            const isLast = i === parts.length - 1;
            const to = `/${parts.slice(0, i + 1).join("/")}`;
            return (
              <li key={to} className="flex items-center gap-2">
                <span className="text-gray-400">{'>'}</span>
                {isLast ? (
                  <span className="font-bold text-gray-900">{decodeURIComponent(p)}</span>
                ) : (
                  <Link to={to} className="text-gray-700 hover:underline">{decodeURIComponent(p)}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };

  const Tabs = () => (
    <div className="relative mt-3 border-b">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {TAB_KEYS.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                const base = location?.pathname || "/live-scores";
                navigate(`${base}?tab=${t.key}`, { replace: true });
              }}
              className={`px-4 py-3 text-sm md:text-base font-semibold border-b-2 -mb-px transition ${active ? "border-[#1e3a5f] text-[#1e3a5f]" : "border-transparent text-gray-600 hover:text-gray-800"}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const DayBar = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 1);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
    return (
      <div className="flex items-center gap-2 flex-wrap mt-3">
        {days.map((d, idx) => {
          const active = selectedDate.toDateString() === d.toDateString();
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(d)}
              className={`px-3 py-2 rounded-md border text-sm min-w-[54px] text-center ${active ? "bg-[#1e3a5f] text-white" : "bg-white text-gray-700"}`}
            >
              <div className="font-semibold">{DAYS[d.getDay()]}</div>
              <div className="text-xs">{d.getDate()}</div>
            </button>
          );
        })}
        <button
          onClick={() => setActiveFilters([])}
          className="ml-2 text-sm px-3 py-2 rounded-md border bg-white"
        >
          Reset
        </button>

        {/* Inline chip filters (no chevrons, no overflow) */}
        <div className="flex gap-2 flex-wrap">
          {CHIP_FILTERS.map((f) => {
            const active = activeFilters.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() =>
                  setActiveFilters((prev) =>
                    prev.includes(f.id) ? prev.filter((x) => x !== f.id) : [...prev, f.id]
                  )
                }
                className={`px-3 py-2 rounded-full border text-sm ${active ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-50"}`}
              >
                <span className="whitespace-normal break-words text-xs sm:text-sm">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Match card: larger, more padding, strict overflow control
  const MatchCard = ({ match }) => {
    if (!match) return null;
    const localRaw =
      match.localteam ??
      match.localTeam ??
      match.participants?.data?.find((p) => p?.is_local) ??
      {};
    const visitorRaw =
      match.visitorteam ??
      match.participants?.data?.find((p) => !p?.is_local) ??
      {};
    const local = teamInfo(localRaw);
    const visitor = teamInfo(visitorRaw);
    const leagueName = match.league?.name || match.stage?.name || "Unknown League";
    const logo = leagueLogo(leagueName);
    const venue = match.venue?.name || "";

    const localRun =
      match.localteam_score?.score ??
      match.runs?.find((r) => r.team_id === match.localteam_id)?.score ??
      null;
    const localWk =
      match.localteam_score?.wickets ??
      match.runs?.find((r) => r.team_id === match.localteam_id)?.wickets_out ??
      null;
    const localOv =
      match.localteam_score?.overs ??
      match.runs?.find((r) => r.team_id === match.localteam_id)?.overs ??
      null;

    const visRun =
      match.visitorteam_score?.score ??
      match.runs?.find((r) => r.team_id === match.visitorteam_id)?.score ??
      null;
    const visWk =
      match.visitorteam_score?.wickets ??
      match.runs?.find((r) => r.team_id === match.visitorteam_id)?.wickets_out ??
      null;
    const visOv =
      match.visitorteam_score?.overs ??
      match.runs?.find((r) => r.team_id === match.visitorteam_id)?.overs ??
      null;

    const last = lastBallEvent(match.balls?.data ?? match.balls ?? []);

    return (
      <Link
        to={`/match/${match.id}`}
        className="block rounded-2xl border bg-white hover:shadow-xl transition no-underline"
      >
        <div className="p-5 sm:p-6 min-h-[172px]">
          <div className="flex items-start gap-3 sm:gap-4">
            <img
              src={logo}
              alt={leagueName}
              className="w-9 h-9 rounded hidden sm:block shrink-0"
              onError={(e) => (e.currentTarget.src = leagueLogo(null))}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 truncate">{leagueName}</div>

                  <div className="mt-1 flex items-center gap-3 sm:gap-4">
                    {/* local team */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {local.flag ? (
                        <img
                          src={local.flag}
                          alt={local.name}
                          className="w-8 h-8 rounded-full border shrink-0 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">
                          {local.name
                            ? local.name
                                .trim()
                                .split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("")
                            : "T"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {local.name}
                        </div>
                        <div className="text-xxs text-gray-400">RR {rr(localRun, localOv)}</div>
                      </div>
                    </div>

                    <div className="text-gray-400 font-medium shrink-0">vs</div>

                    {/* visitor team */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {visitor.flag ? (
                        <img
                          src={visitor.flag}
                          alt={visitor.name}
                          className="w-8 h-8 rounded-full border shrink-0 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">
                          {visitor.name
                            ? visitor.name
                                .trim()
                                .split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("")
                            : "V"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {visitor.name}
                        </div>
                        <div className="text-xxs text-gray-400">RR {rr(visRun, visOv)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm text-gray-500 break-words">
                    {match.type || ""}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold leading-tight">
                    {formatScore(localRun, localWk, localOv)}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 leading-tight">
                    {formatScore(visRun, visWk, visOv)}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2 min-w-0">
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2l4 7h-8l4-7zM2 21h20"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="truncate">{venue}</span>
                </div>
                <div className="text-right min-w-[96px]">
                  {match.note ? (
                    <span className="text-orange-600 font-medium break-words">
                      {match.note}
                    </span>
                  ) : (
                    <span className="text-gray-500 break-words">
                      {match.status || ""}
                    </span>
                  )}
                </div>
              </div>

              {last && (
                <div className="mt-3 text-sm rounded-md bg-blue-50 px-3 py-2 text-blue-900 break-words">
                  <strong className="mr-2">Last ball:</strong> {last.text} (Over {last.over})
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const SeriesBlock = ({ title, list = [] }) => {
    const safe = (list || []).filter(Boolean);
    if (safe.length === 0) return null;
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base md:text-lg font-bold text-gray-800 truncate pr-4">{title}</h3>
          <Link
            to="/fixtures-results"
            className="text-sm font-bold text-[#122537] hover:underline shrink-0"
          >
            See all
          </Link>
        </div>
        {/* Larger cards & tighter gap to fit more content without overflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {safe.map((m) => (
            <MatchCard key={m.id || Math.random()} match={m} />
          ))}
        </div>
      </section>
    );
  };

  // Sidebar: players / news / venues; ensure no overflow
  const Sidebar = () => {
    const playersToShow =
      topPlayers && topPlayers.length ? topPlayers.slice(0, 6) : fallbackPlayersFromRecent;
    const showPlayers = playersToShow && playersToShow.length > 0;

    return (
      <aside className="hidden lg:block lg:w-80 xl:w-96">
        <div className="sticky top-4 space-y-4">
          <div className="rounded-2xl border bg-white p-4">
            <h4 className="font-semibold mb-2">Top Players</h4>
            {!showPlayers ? (
              <div className="text-sm text-gray-600">
                Player rankings currently unavailable. Showing lineup highlights instead.
              </div>
            ) : (
              <ul className="space-y-3">
                {playersToShow.map((p, i) => (
                  <li key={p.id || `${i}`} className="flex items-center gap-3">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.fullname || p.name || p.title}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0">
                        {(p.fullname || p.name || "P").toString().slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {p.fullname || p.name || p.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {p.team || p.country || ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <h4 className="font-semibold mb-2">Trending News</h4>
            {trendingNews && trendingNews.length > 0 ? (
              <div className="space-y-3">
                {trendingNews.slice(0, 5).map((a, i) => (
                  <article key={i} className="flex gap-3 items-start">
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-16 h-12 object-cover rounded shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="min-w-0">
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#122537] hover:text-red-600 block truncate"
                        title={a.title}
                      >
                        {a.title}
                      </a>
                      <div className="text-xs text-gray-500 truncate">
                        {a.source} • {new Date(a.publishedAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-3 text-sm text-gray-700">
                {(recentMatches || []).slice(0, 3).map((m) => (
                  <div key={m.id} className="rounded-md p-2 bg-gray-50">
                    <div className="font-semibold text-sm truncate">
                      {m.localteam?.name || ""} vs {m.visitorteam?.name || ""}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {m.league?.name || m.type || ""} • {m.note || m.status || ""}
                    </div>
                  </div>
                ))}
                {(recentMatches || []).length === 0 && (
                  <div className="text-gray-500">No news or recent matches available.</div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <h4 className="font-semibold mb-2">Trending Venues</h4>
            {trendingVenues.length === 0 ? (
              <div className="text-sm text-gray-600">No trending venues right now.</div>
            ) : (
              <div className="grid gap-2">
                {trendingVenues.slice(0, 4).map((v, i) => (
                  <Link key={i} to={`/stadium/${v.id}`} className="flex items-center gap-3">
                    {/* Show venue image ONLY if it exists; no defaults */}
                    {v.image ? (
                      <img
                        src={v.image}
                        alt={v.name}
                        className="w-12 h-12 object-cover rounded shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="text-sm truncate">{v.name}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    );
  };

  const SkeletonList = ({ count = 3 }) => (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
      ))}
    </div>
  );

  /* ================== RENDER ================== */
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
      <Breadcrumbs />

      <header className="mt-2">
        <h1 className="text-2xl md:text-3xl font-extrabold">Cricket Match Center</h1>
        <p className="text-gray-600 mt-1">Live scores, schedules and results.</p>
        <Tabs />
        {(activeTab === "results" || activeTab === "schedule") && <DayBar />}
      </header>

      <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-6">
        <main className="min-w-0">
          {errorMsg && (
            <div className="rounded p-3 bg-yellow-50 text-yellow-700 mb-4">{errorMsg}</div>
          )}
          {loading && <SkeletonList count={4} />}

          {!loading && activeTab === "live" && (
            <>
              <h2 className="text-xl font-bold mb-3">Top live matches</h2>
              {groupedLive.length === 0 ? (
                <>
                  <div className="rounded-2xl border bg-white p-6 text-center text-gray-600 mb-6">
                    No live matches right now — showing recent results.
                  </div>
                  {groupedResults.length === 0 ? (
                    <div className="rounded-2xl border bg-white p-6 text-center text-gray-600">
                      No recent results available.
                    </div>
                  ) : (
                    groupedResults.map((g) => (
                      <section key={g.series} className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base md:text-lg font-bold text-gray-800 truncate pr-4">
                            {g.series}
                          </h3>
                          <Link
                            to="/fixtures-results"
                            className="text-sm font-bold text-[#122537] hover:underline shrink-0"
                          >
                            See all
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {applyChipFilters(g.list).map((m) => (
                            <MatchCard key={m.id} match={m} />
                          ))}
                        </div>
                      </section>
                    ))
                  )}
                </>
              ) : (
                groupedLive.map((g) => (
                  <SeriesBlock
                    key={g.series}
                    title={g.series}
                    list={applyChipFilters(g.list)}
                  />
                ))
              )}
            </>
          )}

          {!loading && activeTab === "results" && (
            <>
              <h2 className="text-xl font-bold mb-3">Match Results</h2>
              {groupedResults.length === 0 ? (
                <div className="rounded-2xl border bg-white p-6 text-center text-gray-600">
                  No recent results found.
                </div>
              ) : (
                groupedResults.map((g) => (
                  <SeriesBlock
                    key={g.series}
                    title={g.series}
                    list={applyChipFilters(g.list)}
                  />
                ))
              )}
            </>
          )}

          {!loading && activeTab === "schedule" && (
            <>
              <h2 className="text-xl font-bold mb-3">Upcoming Fixtures</h2>
              {groupedUpcoming.length === 0 ? (
                <div className="rounded-2xl border bg-white p-6 text-center text-gray-600">
                  No upcoming fixtures found.
                </div>
              ) : (
                groupedUpcoming.map((g) => (
                  <SeriesBlock
                    key={g.series}
                    title={g.series}
                    list={applyChipFilters(g.list)}
                  />
                ))
              )}
            </>
          )}
        </main>

        <Sidebar />
      </div>

      {/* NOTE: Removed the Teams FAB and bottom sheet entirely as requested */}
    </div>
  );
}
