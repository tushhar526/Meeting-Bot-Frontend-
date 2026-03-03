import { useState, useEffect } from "react"
import { getUserAnalytics, getMeetingTrends } from "../../service/analytics.service"
import { formatDate } from "../../utils/helpers"
import popup from "../../utils/popup/popup"
import "./AnalyticsPage.css"

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function AnalyticsPage() {
    const [analytics, setAnalytics] = useState(null)
    const [trends, setTrends] = useState(null)
    const [loading, setLoading] = useState(true)
    const [trendDays, setTrendDays] = useState(7)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getUserAnalytics().catch((err) => { popup.error(err?.response?.data?.message || "Failed to load analytics."); return null }),
            getMeetingTrends(trendDays).catch(() => null),
        ]).then(([a, t]) => {
            setAnalytics(a)
            setTrends(t)
            setLoading(false)
        })
    }, [trendDays])

    // ── Derived values ──────────────────────────────────────
    const total = analytics?.total_meetings ?? 0
    const avgHours = analytics?.average_duration_hours ?? 0
    const avgLabel = avgHours > 0 ? `${Math.round(avgHours * 60)}m` : "—"
    const thisWeek = analytics?.this_week_meetings ?? 0
    const thisMonth = analytics?.this_month_meetings ?? 0

    const byDay = analytics?.meetings_by_day ?? {}
    const maxDay = Math.max(...DAY_ORDER.map((d) => byDay[d] ?? 0), 1)

    // Trend bars (daily)
    const trendEntries = trends
        ? Object.entries(trends.daily_trends).slice(-trendDays)
        : []
    const maxTrend = Math.max(...trendEntries.map(([, v]) => v), 1)

    const summaryCards = [
        { label: "Total Meetings", value: total, color: "purple" },
        { label: "Avg Duration", value: avgLabel, color: "blue" },
        { label: "This Week", value: thisWeek, color: "green" },
        { label: "This Month", value: thisMonth, color: "amber" },
    ]

    const recentMeetings = analytics?.recent_meetings ?? []
    const platformDist = analytics?.platform_distribution ?? {}

    return (
        <div className="analytics-page">

            {/* ── Summary Cards ── */}
            <div className="analytics-summary">
                {summaryCards.map((card) => (
                    <div className="summary-card" key={card.label}>
                        <div className={`summary-dot ${card.color}`} />
                        <div className="summary-info">
                            <span className="summary-value">
                                {loading ? <span className="ana-skeleton" /> : card.value}
                            </span>
                            <span className="summary-label">{card.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="analytics-grid">

                {/* ── Activity / Trend Chart ── */}
                <div className="chart-card wide">
                    <div className="chart-header">
                        <h3>Meeting Activity</h3>
                        <div className="chart-filters">
                            {[
                                { label: "7d", days: 7 },
                                { label: "30d", days: 30 },
                                { label: "90d", days: 90 },
                            ].map((f) => (
                                <button
                                    key={f.days}
                                    className={`chart-filter ${trendDays === f.days ? "active" : ""}`}
                                    onClick={() => setTrendDays(f.days)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="chart-placeholder"><p className="chart-empty-text">Loading…</p></div>
                    ) : trendEntries.length === 0 || trends?.total_meetings_in_period === 0 ? (
                        <div className="chart-placeholder"><p className="chart-empty-text">No activity data yet</p></div>
                    ) : (
                        <div className="trend-bars">
                            {trendEntries.map(([date, count]) => (
                                <div className="trend-bar-group" key={date}>
                                    <span className="trend-bar-count">{count > 0 ? count : ""}</span>
                                    <div
                                        className="trend-bar"
                                        style={{ height: `${Math.max((count / maxTrend) * 140, count > 0 ? 8 : 4)}px` }}
                                    />
                                    <span className="trend-bar-label">
                                        {new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── By Day of Week ── */}
                <div className="chart-card">
                    <div className="chart-header"><h3>By Day of Week</h3></div>
                    <div className="dow-bars">
                        {DAY_ORDER.map((day) => {
                            const count = byDay[day] ?? 0
                            const pct = (count / maxDay) * 100
                            return (
                                <div className="dow-row" key={day}>
                                    <span className="dow-label">{day.slice(0, 3)}</span>
                                    <div className="dow-bar-track">
                                        <div className="dow-bar" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="dow-count">{loading ? "—" : count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Platform Distribution ── */}
                <div className="chart-card">
                    <div className="chart-header"><h3>Platforms</h3></div>
                    <div className="platform-dist">
                        {Object.keys(platformDist).length === 0 ? (
                            <p className="chart-empty-text" style={{ position: "static", transform: "none", padding: "1rem 0" }}>No data yet</p>
                        ) : Object.entries(platformDist).map(([plat, count]) => (
                            <div className="plat-row" key={plat}>
                                <span className={`platform-badge platform-${plat.toLowerCase()}`}>{plat}</span>
                                <div className="plat-bar-track">
                                    <div
                                        className="plat-bar"
                                        style={{ width: `${(count / total) * 100}%` }}
                                    />
                                </div>
                                <span className="plat-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Recent Meetings ── */}
                <div className="chart-card wide">
                    <div className="chart-header"><h3>Recent Meetings</h3></div>
                    {recentMeetings.length === 0 ? (
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", padding: "1rem 0" }}>No meetings yet.</p>
                    ) : (
                        <div className="recent-table">
                            <div className="recent-thead">
                                <span>Platform</span>
                                <span>URL</span>
                                <span>Status</span>
                                <span>Date</span>
                                <span>Duration</span>
                            </div>
                            {recentMeetings.map((m) => (
                                <div className="recent-row" key={m.job_id}>
                                    <span className={`platform-badge platform-${m.platform?.toLowerCase()}`}>{m.platform}</span>
                                    <span className="recent-url" title={m.meeting_url}>{m.meeting_url}</span>
                                    <span className={`status-chip status-${m.status?.toLowerCase()}`}>{m.status}</span>
                                    <span className="recent-date">{formatDate(m.created_at)}</span>
                                    <span className="recent-dur">
                                        {m.duration_hours != null ? `${Math.round(m.duration_hours * 60)}m` : "—"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
