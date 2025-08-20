// src/pages/LiveScorePage.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  if (overs === null || overs === undefined || Number.isNaN(overs)) return "—";
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
  if (score === null || score === undefined) return "—";
  if (!overs || overs <= 0) return "—";
  return (score / overs).toFixed(2);
};

const teamInfo = (team) => ({
  name: team?.name || "Unknown",
  flag: team?.image_path || team?.image || team?.logo_path || null, // null if absent
});

const leagueLogo = (leagueName) => LEAGUE_LOGOS[leagueName] || LEAGUE_LOGOS.default;

// Robust last ball reader (no undefined.undefined)
const lastBallEvent = (ballsData) => {
  if (!Array.isArray(ballsData) || ballsData.length === 0) return null;
  const b = ballsData[ballsData.length - 1] || {};
  const out = [];

  // textual outcome
  if (b.batsmanout || b.wicket) out.push("WICKET ⚰️");
  else if (b.score?.run === 6 || b.runs === 6) out.push("SIX 🎉");
  else if (b.score?.run === 4 || b.runs === 4) out.push("FOUR 🏏");
  else if ((b.score && Number(b.score.run) > 0) || Number(b.runs) > 0) {
    const r = b.score?.run ?? b.runs;
    out.push(`${r} ${r === 1 ? "run" : "runs"}`);
  } else out.push("Dot ball");

  // over/ball may be absent in some feeds — guard it
  const overNum =
    b.over_number ??
    b.overNumber ??
    (typeof b.over === "number" ? b.over : undefined);

  const ballNum =
    b.ball_number ??
    b.ballNumber ??
    (typeof b.ball === "number" ? b.ball : undefined);

  const overStr =
    Number.isFinite(overNum) && Number.isFinite(ballNum)
      ? `${overNum}.${ballNum}`
      : null;

  return { text: out.join(", "), over: overStr };
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

        const pLive = fetchLiveMatches?.().catch((e) => {
          console.warn(e);
          return [];
        });
        const pRecent = fetchRecentMatches?.().catch((e) => {
          console.warn(e);
          return [];
        });
        const pUpcoming = fetchUpcomingMatches?.().catch((e) => {
          console.warn(e);
          return [];
        });
        const pPlayers = optionalFetchTopPlayers
          ? optionalFetchTopPlayers().catch((e) => {
              console.warn(e);
              return [];
            })
          : Promise.resolve([]);
        const pHeadlines = optionalFetchTopHeadlines
          ? optionalFetchTopHeadlines().catch((e) => {
              console.warn(e);
              return [];
            })
          : Promise.resolve([]);
        const pTrending = optionalFetchTrendingNews
          ? optionalFetchTrendingNews().catch((e) => {
              console.warn(e);
              return [];
            })
          : Promise.resolve([]);

        const [live, recent, upcoming, players, headlines, trending] =
          await Promise.all([pLive, pRecent, pUpcoming, pPlayers, pHeadlines, pTrending]);

        if (!mounted) return;

        setLiveMatches(Array.isArray(live) ? live : []);
        setRecentMatches(Array.isArray(recent) ? recent : []);
        setUpcomingMatches(Array.isArray(upcoming) ? upcoming : []);
        setTopPlayers(Array.isArray(players) ? players : []);

        const news =
          (Array.isArray(headlines) && headlines.length ? headlines : []) ||
          (Array.isArray(trending) ? trending : []);
        setTrendingNews(news);

        // simple trending venues fallback (no placeholders)
        const tv = (Array.isArray(recent) ? recent : [])
          .slice(0, 6)
          .map((m) => ({
            id: m?.venue?.id,
            name: m?.venue?.name,
            image: m?.venue?.image_path || null, // null if absent -> won't render
          }))
          .filter((v) => v?.name);
        setTrendingVenues(tv);
      } catch (err) {
        console.error("loadAll error:", err);
        setErrorMsg(
          "Some content couldn't be loaded from the backend; showing available fallbacks."
        );
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
    const candidates = [m.type, m.round, m.league?.format, m.league?.type, m.stage?.name].filter(
      Boolean
    );
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
      const isIntl =
        league.includes("world") || league.includes("icc") || league.includes("international");
      const isDomestic = !isIntl;
      return activeFilters.every((f) => {
        switch (f) {
          case "t20":
            return type.includes("t20");
          case "odi":
            return type.includes("odi");
          case "tests":
            return type.includes("test");
          case "intl":
            return isIntl;
          case "domestic":
            return isDomestic;
          case "men":
            return gender === "men";
          case "women":
            return gender === "women";
          case "fc":
            return type.includes("fc") || type.includes("first");
          case "youth":
            return league.includes("u19") || league.includes("youth");
          case "listA":
            return type.includes("list a") || type.includes("list-a");
          case "others":
            return !(type.includes("t20") || type.includes("odi") || type.includes("test"));
          default:
            return true;
        }
      });
    });
  };

  /* ======= Derive “Form Players” fallback when /players/top fails ======= */
  const derivedFormPlayers = useMemo(() => {
    // collect batters/wickets from recent + live
    const buckets = new Map(); // name -> {runs, wickets, image, team}
    const harvest = (arr) => {
      (arr || []).forEach((m) => {
        // batting: look into scorecards if present
        (m.scoreboards || m.scorecard || []).forEach((sb) => {
          (sb.batting || sb.batsmen || []).forEach((row) => {
            const name = row?.batsman?.fullname || row?.batsman?.name || row?.batsman_name;
            const runs = Number(row?.score || row?.runs || 0);
            const img =
              row?.batsman?.image_path ||
              row?.batsman?.image ||
              row?.player?.image_path ||
              null;
            const team = sb?.team?.name || "";
            if (name && runs) {
              const cur = buckets.get(name) || { runs: 0, wickets: 0, image: img, team };
              cur.runs += runs;
              if (!cur.image && img) cur.image = img;
              if (!cur.team && team) cur.team = team;
              buckets.set(name, cur);
            }
          });
          (sb.bowling || sb.bowlers || []).forEach((row) => {
            const name = row?.bowler?.fullname || row?.bowler?.name || row?.bowler_name;
            const wk = Number(row?.wickets || 0);
            const img =
              row?.bowler?.image_path || row?.player?.image_path || row?.bowler?.image || null;
            const team = sb?.team?.name || "";
            if (name && wk) {
              const cur = buckets.get(name) || { runs: 0, wickets: 0, image: img, team };
              cur.wickets += wk;
              if (!cur.image && img) cur.image = img;
              if (!cur.team && team) cur.team = team;
              buckets.set(name, cur);
            }
          });
        });
      });
    };
    harvest(recentMatches);
    harvest(liveMatches);

    const arr = Array.from(buckets.entries()).map(([name, v]) => ({
      id: `form-${name}`,
      name,
      image: v.image || null,
      team: v.team || "",
      runs: v.runs,
      wickets: v.wickets,
    }));

    // rank: prioritize wickets, then runs
    arr.sort((a, b) => (b.wickets || 0) - (a.wickets || 0) || (b.runs || 0) - (a.runs || 0));
    return arr.slice(0, 8);
  }, [recentMatches, liveMatches]);

  const playersToShow = useMemo(() => {
    if (Array.isArray(topPlayers) && topPlayers.length) return topPlayers.slice(0, 8);
    if (Array.isArray(derivedFormPlayers) && derivedFormPlayers.length)
      return derivedFormPlayers;
    // final safety: mine Man of the Match names from recent
    const mop = [];
    (recentMatches || []).forEach((m) => {
      const p = m.man_of_match || m.manofmatch || m.man_of_the_match;
      const name = p?.name || p;
      if (name && !mop.find((x) => x.name === name)) {
        mop.push({ id: `mop-${name}`, name, team: m.localteam?.name || m.visitorteam?.name });
      }
    });
    return mop.slice(0, 6);
  }, [topPlayers, derivedFormPlayers, recentMatches]);

  /* ================== UI SUBCOMPONENTS ================== */

  // Breadcrumbs
  const Breadcrumbs = () => {
    const { pathname } = location;
    const parts = pathname.split("/").filter(Boolean);
    return (
      <nav className="text-[12px] sm:text-sm text-gray-600 mb-1" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 sm:gap-2">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          {parts.map((p, i) => {
            const isLast = i === parts.length - 1;
            const to = `/${parts.slice(0, i + 1).join("/")}`;
            return (
              <li key={to} className="flex items-center gap-1 sm:gap-2">
                <span className="text-gray-400">{">"}</span>
                {isLast ? (
                  <span className="font-semibold text-gray-900">{decodeURIComponent(p)}</span>
                ) : (
                  <Link to={to} className="text-gray-700 hover:underline">
                    {decodeURIComponent(p)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };

  // Sticky Tabs
  const Tabs = () => (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
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
              className={`px-4 py-3 text-sm sm:text-base font-semibold border-b-2 -mb-[1px] transition ${
                active
                  ? "border-[#1e3a5f] text-[#1e3a5f]"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
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
              className={`px-2.5 sm:px-3 py-2 rounded-md border text-xs sm:text-sm min-w-[50px] text-center ${
                active ? "bg-[#1e3a5f] text-white" : "bg-white text-gray-700"
              }`}
            >
              <div className="font-semibold">{DAYS[d.getDay()]}</div>
              <div className="text-[11px] sm:text-xs">{d.getDate()}</div>
            </button>
          );
        })}
        <button onClick={() => setActiveFilters([])} className="ml-1 sm:ml-2 text-xs sm:text-sm px-3 py-2 rounded-md border bg-white">
          Reset
        </button>

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
                className={`px-3 py-2 rounded-full border text-xs sm:text-sm ${
                  active ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-50"
                }`}
              >
                <span className="whitespace-normal break-words">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Match card: “tabular” feel with faint dividers and hierarchy
  const MatchCard = ({ match }) => {
    if (!match) return null;
    const localRaw =
      match.localteam ??
      match.localTeam ??
      match.participants?.data?.find((p) => p?.is_local) ??
      {};
    const visitorRaw =
      match.visitorteam ?? match.participants?.data?.find((p) => !p?.is_local) ?? {};
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
        className="block rounded-2xl border border-gray-200 bg-white hover:shadow-md transition no-underline"
      >
        <div className="p-4 sm:p-5">
          {/* top row */}
          <div className="flex items-start gap-3 sm:gap-4">
            <img
              src={logo}
              alt={leagueName}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded hidden sm:block shrink-0"
              onError={(e) => (e.currentTarget.src = leagueLogo(null))}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] sm:text-xs text-gray-500 truncate">{leagueName}</div>

                  <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
                    {/* local */}
                    <div className="flex items-center gap-2 min-w-0">
                      {local.flag ? (
                        <img
                          src={local.flag}
                          alt={local.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border shrink-0 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-gray-700 shrink-0">
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
                        <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                          {local.name}
                        </div>
                        <div className="text-[11px] text-gray-500">RR {rr(localRun, localOv)}</div>
                      </div>
                    </div>

                    <div className="text-gray-400 font-medium text-xs sm:text-sm px-1 text-center">
                      vs
                    </div>

                    {/* visitor */}
                    <div className="flex items-center gap-2 min-w-0 justify-end">
                      <div className="min-w-0 text-right">
                        <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                          {visitor.name}
                        </div>
                        <div className="text-[11px] text-gray-500">RR {rr(visRun, visOv)}</div>
                      </div>
                      {visitor.flag ? (
                        <img
                          src={visitor.flag}
                          alt={visitor.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border shrink-0 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-gray-700 shrink-0">
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
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2 border-l border-gray-200">
                  <div className="text-[11px] sm:text-xs text-gray-500 break-words">
                    {match.type || ""}
                  </div>
                  <div className="text-lg sm:text-xl font-bold leading-tight">
                    {formatScore(localRun, localWk, localOv)}
                  </div>
                  <div className="text-sm sm:text-base text-gray-700 leading-tight">
                    {formatScore(visRun, visWk, visOv)}
                  </div>
                </div>
              </div>

              {/* divider row */}
              <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between text-[12px] sm:text-xs text-gray-600">
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none">
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
                    <span className="text-orange-600 font-medium break-words">{match.note}</span>
                  ) : (
                    <span className="text-gray-500 break-words">{match.status || ""}</span>
                  )}
                </div>
              </div>

              {last && (
                <div className="mt-3 text-[13px] sm:text-sm rounded-md bg-blue-50 px-3 py-2 text-blue-900 break-words">
                  <strong className="mr-1.5">Last ball:</strong> {last.text}
                  {last.over ? <span> (Over {last.over})</span> : null}
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
      <section className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 truncate pr-4">
            {title}
          </h3>
          <Link
            to="/fixtures-results"
            className="text-xs sm:text-sm font-bold text-[#122537] hover:underline shrink-0"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
          {safe.map((m) => (
            <MatchCard key={m.id || Math.random()} match={m} />
          ))}
        </div>
      </section>
    );
  };

  // Sidebar
  const Sidebar = () => {
    const showPlayers = playersToShow && playersToShow.length > 0;

    return (
      <aside className="hidden lg:block lg:w-80 xl:w-96">
        <div className="sticky top-20 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h4 className="font-semibold mb-2">Top Players</h4>
            {!showPlayers ? (
              <div className="text-sm text-gray-600">
                Player rankings currently unavailable.
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
                        {p.runs ? ` • ${p.runs} runs` : ""}
                        {p.wickets ? ` • ${p.wickets} wkts` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
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
                  <div key={m.id} className="rounded-md p-2 bg-gray-50 border border-gray-100">
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

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h4 className="font-semibold mb-2">Trending Venues</h4>
            {trendingVenues.length === 0 ? (
              <div className="text-sm text-gray-600">No trending venues right now.</div>
            ) : (
              <div className="grid gap-2">
                {trendingVenues.slice(0, 4).map((v, i) => (
                  <Link key={i} to={`/stadium/${v.id}`} className="flex items-center gap-3">
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
    <div className="max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <Breadcrumbs />

      <header className="mt-1 sm:mt-2 mb-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">Cricket Match Center</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Live scores, schedules and results.</p>
      </header>

      <Tabs />
      {(activeTab === "results" || activeTab === "schedule") && <DayBar />}

      <div className="mt-4 sm:mt-6 grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
        <main className="min-w-0">
          {errorMsg && (
            <div className="rounded p-3 bg-yellow-50 text-yellow-700 mb-4">{errorMsg}</div>
          )}
          {loading && <SkeletonList count={4} />}

          {!loading && activeTab === "live" && (
            <>
              <h2 className="text-lg sm:text-xl font-bold mb-3">Top live matches</h2>
              {groupedLive.length === 0 ? (
                <>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600 mb-6">
                    No live matches right now — showing recent results.
                  </div>
                  {groupedResults.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600">
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
                  <SeriesBlock key={g.series} title={g.series} list={applyChipFilters(g.list)} />
                ))
              )}
            </>
          )}

          {!loading && activeTab === "results" && (
            <>
              <h2 className="text-lg sm:text-xl font-bold mb-3">Match Results</h2>
              {groupedResults.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600">
                  No recent results found.
                </div>
              ) : (
                groupedResults.map((g) => (
                  <SeriesBlock key={g.series} title={g.series} list={applyChipFilters(g.list)} />
                ))
              )}
            </>
          )}

          {!loading && activeTab === "schedule" && (
            <>
              <h2 className="text-lg sm:text-xl font-bold mb-3">Upcoming Fixtures</h2>
              {groupedUpcoming.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600">
                  No upcoming fixtures found.
                </div>
              ) : (
                groupedUpcoming.map((g) => (
                  <SeriesBlock key={g.series} title={g.series} list={applyChipFilters(g.list)} />
                ))
              )}
            </>
          )}
        </main>

        <Sidebar />
      </div>
    </div>
  );
}
