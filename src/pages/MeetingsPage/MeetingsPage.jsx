import { useState, useEffect, useRef } from "react"
import { startMeeting, getMeetingStatus } from "../../service/meetings.service"
import { downloadRecording } from "../../service/recordings.service"
import { getUserAnalytics } from "../../service/analytics.service"
import { formatDate, loadStoredJobIds, saveStoredJobIds, triggerBlobDownload } from "../../utils/helpers"
import popup from "../../utils/popup/popup"
import "./MeetingsPage.css"

const PLATFORMS = [
    {
        id: "meet",
        label: "Google Meet",
        placeholder: "https://meet.google.com/abc-defg-hij",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
        ),
    },
    {
        id: "teams",
        label: "Microsoft Teams",
        placeholder: "https://teams.microsoft.com/l/meetup-join/...",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M20.25 6.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z" fill="#5059C9" />
                <path d="M13.5 7.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="#7B83EB" />
                <path d="M22.5 8.25h-2.25a1.5 1.5 0 0 0-1.5 1.5V15a3 3 0 0 1-3 3 5.25 5.25 0 0 0 5.25-5.25V9.75a1.5 1.5 0 0 0-1.5-1.5z" fill="#5059C9" />
                <rect x="9" y="8.25" width="9" height="9.75" rx="1.5" fill="#7B83EB" />
                <path d="M9 8.25H6.75A1.5 1.5 0 0 0 5.25 9.75V15a7.5 7.5 0 0 0 7.5 7.5h.75A5.25 5.25 0 0 1 8.25 18V9.75A1.5 1.5 0 0 1 9 8.25z" fill="#4B53BC" />
            </svg>
        ),
    },
    {
        id: "zoom",
        label: "Zoom",
        placeholder: "https://zoom.us/j/1234567890",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#2D8CFF" />
                <path d="M4 8.5C4 7.67 4.67 7 5.5 7h8C14.33 7 15 7.67 15 8.5v4.75L20 17V7l-5 3.25V8.5C15 7.67 14.33 7 13.5 7h-8C4.67 7 4 7.67 4 8.5v7C4 16.33 4.67 17 5.5 17h8c.83 0 1.5-.67 1.5-1.5V14.5L4 11.25V8.5z" fill="white" />
            </svg>
        ),
    },
]

const STATUS_COLORS = {
    Registered: "status-registered",
    Running: "status-running",
    Completed: "status-completed",
    Failed: "status-failed",
}

const TERMINAL_STATUSES = new Set(["Completed", "Failed"])

function JobRow({ job, onDownload }) {
    const status = job.status || "Registered"
    return (
        <div className="job-row">
            <div className="job-platform">
                <span className={`platform-badge platform-${job.platform?.toLowerCase()}`}>
                    {job.platform}
                </span>
            </div>
            <div className="job-url" title={job.job_url}>
                {job.job_url}
            </div>
            <div className="job-status">
                <span className={`status-chip ${STATUS_COLORS[status] || "status-registered"}`}>
                    {status === "Running" && <span className="status-pulse" />}
                    {status}
                </span>
            </div>
            <div className="job-time">{formatDate(job.created_at)}</div>
            <div className="job-actions">
                {job.audio_path && status === "Completed" && (
                    <button
                        className="download-btn"
                        onClick={() => onDownload(job.job_id)}
                        title="Download recording"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download
                    </button>
                )}
            </div>
        </div>
    )
}



export function MeetingsPage() {
    const [platform, setPlatform] = useState("meet")
    const [meetingUrl, setMeetingUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [jobs, setJobs] = useState({})          // { [job_id]: jobObject }
    const [jobIds, setJobIds] = useState(loadStoredJobIds)
    const [initDone, setInitDone] = useState(false)
    const [currentMeeting, setCurrentMeeting] = useState(null)
    const pollRef = useRef(null)

    const selectedPlatform = PLATFORMS.find((p) => p.id === platform)

    // ── Fetch a single job and update state ─────────────────
    const fetchJob = async (id) => {
        try {
            const job = await getMeetingStatus(id)
            setJobs((prev) => ({ ...prev, [id]: job }))
            
            // Set as current meeting if it's running
            if (job.status === "Running") {
                setCurrentMeeting(job)
            } else if (currentMeeting?.job_id === id && job.status !== "Running") {
                setCurrentMeeting(null)
            }
            
            return job
        } catch {
            return null
        }
    }

    // ── Initial load: fetch all stored jobs ─────────────────
    useEffect(() => {
        const ids = loadStoredJobIds()
        if (ids.length === 0) { setInitDone(true); return }
        Promise.all(ids.map(fetchJob)).finally(() => setInitDone(true))
    }, [])

    // ── Polling: only poll non-terminal jobs every 5 s ──────
    useEffect(() => {
        clearInterval(pollRef.current)
        const activeIds = jobIds.filter((id) => {
            const j = jobs[id]
            return !j || !TERMINAL_STATUSES.has(j.status)
        })
        if (activeIds.length === 0) return
        pollRef.current = setInterval(() => {
            activeIds.forEach(fetchJob)
        }, 5000)
        return () => clearInterval(pollRef.current)
    }, [jobIds, jobs])

    // ── Validate URL based on platform ────────────────────────
    const validateUrl = (url, platformId) => {
        const urlLower = url.toLowerCase()
        
        switch (platformId) {
            case "meet":
                return urlLower.includes("meet.google.com")
            case "teams":
                return urlLower.includes("teams.live.com") || urlLower.includes("teams.microsoft.com")
            case "zoom":
                return urlLower.includes("zoom.us") || urlLower.includes("us05web.zoom.us")
            default:
                return false
        }
    }

    // ── Send bot ────────────────────────────────────────────
    const handleSendBot = async (e) => {
        e.preventDefault()
        if (!meetingUrl.trim()) {
            popup.warn("Please enter a meeting URL.")
            return
        }
        
        if (!validateUrl(meetingUrl, platform)) {
            const platformInfo = PLATFORMS.find(p => p.id === platform)
            let expectedDomain = ""
            
            switch (platform) {
                case "meet":
                    expectedDomain = "meet.google.com"
                    break
                case "teams":
                    expectedDomain = "teams.live.com or teams.microsoft.com"
                    break
                case "zoom":
                    expectedDomain = "zoom.us or us05web.zoom.us"
                    break
            }
            
            popup.warn(`Invalid ${platformInfo.label} URL. Please ensure the URL contains ${expectedDomain}`)
            return
        }
        
        setLoading(true)
        const toastId = popup.loading(`Sending bot to ${selectedPlatform.label}…`)
        try {
            const data = await startMeeting(meetingUrl, platform)
            const newId = data?.job_id

            if (newId !== undefined) {
                const newIds = [newId, ...jobIds]
                setJobIds(newIds)
                saveStoredJobIds(newIds)
                setJobs((prev) => ({ ...prev, [newId]: data }))
                
                // Set as current meeting immediately
                setCurrentMeeting(data)
                fetchJob(newId)
            }

            popup.dismiss(toastId)
            popup.success(`Bot is joining your ${selectedPlatform.label} meeting!`)
            setMeetingUrl("")
        } catch (err) {
            popup.dismiss(toastId)
            popup.error(err?.response?.data?.message || "Failed to start bot.")
        } finally {
            setLoading(false)
        }
    }

    // ── Download recording ───────────────────────────────────
    const handleDownload = async (jobId) => {
        const toastId = popup.loading("Preparing download…")
        try {
            const blob = await downloadRecording(jobId)
            popup.dismiss(toastId)
            triggerBlobDownload(blob, `recording_${jobId}.wav`)
            popup.success("Download started.")
        } catch {
            popup.dismiss(toastId)
            popup.error("Failed to download recording.")
        }
    }

    const jobList = jobIds.map((id) => jobs[id]).filter(Boolean)
    const activeJobs = jobList.filter((j) => !TERMINAL_STATUSES.has(j.status))
    const pastJobs = jobList.filter((j) => TERMINAL_STATUSES.has(j.status))

    const tableHead = (
        <div className="jobs-thead">
            <span>Platform</span>
            <span>Meeting URL</span>
            <span>Status</span>
            <span>Started</span>
            <span></span>
        </div>
    )

    return (
        <div className="meetings-page">

            {/* ── Start Card ── */}
            <section className="meetings-start">
                <div className="start-card">
                    <div className="start-header">
                        <div className="start-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                        </div>
                        <div>
                            <h2>Send Bot to Meeting</h2>
                            <p>Choose your platform and paste the meeting link</p>
                        </div>
                    </div>

                    {/* Platform Tabs */}
                    <div className="platform-tabs">
                        {PLATFORMS.map((p) => (
                            <button
                                key={p.id}
                                className={`platform-tab ${platform === p.id ? "active" : ""}`}
                                onClick={() => { setPlatform(p.id); setMeetingUrl(""); }}
                                type="button"
                            >
                                {p.icon}
                                <span>{p.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSendBot} className="start-form">
                        <div className="start-input-row">
                            <input
                                type="url"
                                value={meetingUrl}
                                onChange={(e) => setMeetingUrl(e.target.value)}
                                placeholder={selectedPlatform.placeholder}
                                disabled={loading}
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? <span className="btn-spinner" /> : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                )}
                                <span>{loading ? "Sending…" : "Send Bot"}</span>
                            </button>
                        </div>
                    </form>

                </div>
            </section>

            {/* ── Active Sessions ── */}
            {activeJobs.length > 0 && (
                <section className="meetings-section">
                    <div className="section-header">
                        <h3>Active Sessions</h3>
                        <span className="live-badge">● LIVE</span>
                    </div>
                    <div className="jobs-table">
                        {tableHead}
                        {activeJobs.map((j) => (
                            <JobRow key={j.job_id} job={j} onDownload={handleDownload} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Current Meeting Details ── */}
            {currentMeeting && (
                <section className="meetings-section">
                    <div className="section-header">
                        <h3>Current Meeting Details</h3>
                        <span className={`status-chip status-${currentMeeting.status?.toLowerCase()}`}>
                            {currentMeeting.status}
                        </span>
                    </div>
                    <div className="current-meeting-details">
                        <div className="meeting-info-grid">
                            <div className="info-item">
                                <label>Meeting URL</label>
                                <a href={currentMeeting.meeting_url} target="_blank" rel="noopener noreferrer">
                                    {currentMeeting.meeting_url}
                                </a>
                            </div>
                            <div className="info-item">
                                <label>Platform</label>
                                <span className={`platform-badge platform-${currentMeeting.platform}`}>
                                    {currentMeeting.platform}
                                </span>
                            </div>
                            <div className="info-item">
                                <label>Status</label>
                                <span className={`status-chip status-${currentMeeting.status?.toLowerCase()}`}>
                                    {currentMeeting.status}
                                </span>
                            </div>
                            <div className="info-item">
                                <label>Started At</label>
                                <span>{formatDate(currentMeeting.created_at)}</span>
                            </div>
                            {currentMeeting.duration && (
                                <div className="info-item">
                                    <label>Duration</label>
                                    <span>{currentMeeting.duration} minutes</span>
                                </div>
                            )}
                            {currentMeeting.transcript && (
                                <div className="info-item full-width">
                                    <label>Live Transcript</label>
                                    <div className="transcript-preview">
                                        {currentMeeting.transcript}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Meeting History ── */}
            <section className="meetings-section">
                <div className="section-header">
                    <h3>Meeting History</h3>
                </div>

                {!initDone ? (
                    <div className="jobs-loading">
                        <span className="btn-spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
                        <p>Loading meetings…</p>
                    </div>
                ) : jobList.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                        </div>
                        <h4>No meetings yet</h4>
                        <p>Send the bot to a meeting using the form above.</p>
                    </div>
                ) : (
                    <div className="jobs-table">
                        {tableHead}
                        {jobList.map((j) => (
                            <JobRow key={j.job_id} job={j} onDownload={handleDownload} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
