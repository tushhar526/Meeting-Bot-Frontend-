import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { getUserAnalytics } from "../../service/analytics.service"
import { formatDate } from "../../utils/helpers"
import popup from "../../utils/popup/popup"
import "./HomePage.css"

export function HomePage() {
    const { userState } = useAuth()
    const username = userState?.username || "User"
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getUserAnalytics()
            .then((data) => {
                setAnalytics(data)
                setLoading(false)
            })
            .catch((err) => {
                popup.error(err?.response?.data?.message || "Failed to load analytics.")
                setLoading(false)
            })
    }, [])

    // Calculate stats from analytics data
    const totalMeetings = analytics?.total_meetings ?? 0
    const totalHours = analytics?.average_duration_hours ?
        Math.round(analytics.average_duration_hours * totalMeetings) : 0
    const completedMeetings = analytics?.completed_meetings ?? 0
    const thisWeekMeetings = analytics?.this_week_meetings ?? 0

    const recentMeetings = analytics?.recent_meetings?.slice(0, 5) ?? []

    return (
        <div className="dashboard">
            {/* ── Welcome Banner ── */}
            <div className="dashboard-banner">
                <div className="banner-content">
                    <h2>Welcome back, <span>{username}</span> </h2>
                    <p>Here's what's happening with your meetings today.</p>
                </div>
                <div className="banner-decoration">
                    <div className="banner-circle c1" />
                    <div className="banner-circle c2" />
                    <div className="banner-circle c3" />
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon-wrap amber">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                    </div>
                    <div className="stat-info">
                        <h3>{loading ? "..." : totalMeetings}</h3>
                        <p>Total Meetings</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrap amber">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <div className="stat-info">
                        <h3>{loading ? "..." : `${totalHours}h`}</h3>
                        <p>Hours Recorded</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrap amber">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    </div>
                    <div className="stat-info">
                        <h3>{loading ? "..." : completedMeetings}</h3>
                        <p>Completed</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrap amber">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                    <div className="stat-info">
                        <h3>{loading ? "..." : thisWeekMeetings}</h3>
                        <p>This Week</p>
                    </div>
                </div>
            </div>

            {/* ── Recent Meetings ── */}
            <section className="dashboard-section">
                <div className="section-header">
                    <h3>Recent Meetings</h3>
                </div>
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading recent meetings...</p>
                    </div>
                ) : recentMeetings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                        </div>
                        <h4>No meetings yet</h4>
                        <p>Start a meeting from the <strong>Meetings</strong> page to see your history here.</p>
                    </div>
                ) : (
                    <div className="recent-meetings-list">
                        {recentMeetings.map((meeting) => (
                            <div className="recent-meeting-item" key={meeting.job_id}>
                                <div className="meeting-info">
                                    <div className="meeting-header">
                                        <span className={`platform-badge platform-${meeting.platform?.toLowerCase()}`}>
                                            {meeting.platform}
                                        </span>
                                        <span className={`status-chip status-${meeting.status?.toLowerCase()}`}>
                                            {meeting.status}
                                        </span>
                                    </div>
                                    <div className="meeting-url" title={meeting.meeting_url}>
                                        {meeting.meeting_url}
                                    </div>
                                    <div className="meeting-meta">
                                        <span className="meeting-date">{formatDate(meeting.created_at)}</span>
                                        {meeting.duration_hours != null && (
                                            <span className="meeting-duration">
                                                {Math.round(meeting.duration_hours * 60)}m
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
