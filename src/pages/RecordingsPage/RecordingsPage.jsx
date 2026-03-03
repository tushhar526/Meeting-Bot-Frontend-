import { useState, useEffect } from "react"
import { getUserRecordings, downloadRecording, streamRecording } from "../../service/recordings.service"
import { formatDate } from "../../utils/helpers"
import popup from "../../utils/popup/popup"
import "./RecordingsPage.css"

export function RecordingsPage() {
    const [recordings, setRecordings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentAudio, setCurrentAudio] = useState(null)

    useEffect(() => {
        loadRecordings()
        return () => {
            // Clean up audio when component unmounts
            if (currentAudio) {
                currentAudio.pause()
                setCurrentAudio(null)
            }
        }
    }, [])

    const loadRecordings = async () => {
        try {
            const data = await getUserRecordings()
            // Ensure data is an array, fallback to empty array if not
            setRecordings(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to load recordings:", error)
            popup.error("Failed to load recordings")
            setRecordings([]) // Set to empty array on error
        } finally {
            setLoading(false)
        }
    }

    const handlePlay = async (recording) => {
        try {
            // Stop current audio if playing
            if (currentAudio) {
                currentAudio.pause()
                setCurrentAudio(null)
            }

            // Get streaming URL
            const streamUrl = await streamRecording(recording.job_id)
            
            // Create new audio element
            const audio = new Audio(streamUrl)
            audio.play().catch(err => {
                popup.error("Failed to play recording")
            })
            
            setCurrentAudio(audio)
            
            // Clean up when audio ends
            audio.addEventListener('ended', () => {
                setCurrentAudio(null)
            })
        } catch (error) {
            popup.error("Failed to load recording")
        }
    }

    const handleDownload = async (recording) => {
        try {
            const blob = await downloadRecording(recording.job_id)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `meeting_recording_${recording.job_id}.mp3`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            popup.success("Download started")
        } catch (error) {
            popup.error("Failed to download recording")
        }
    }

    const filteredRecordings = (Array.isArray(recordings) ? recordings : []).filter(recording => {
        const matchesFilter = filter === "all" || 
            (filter === "week" && new Date(recording.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
            (filter === "month" && new Date(recording.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        
        const matchesSearch = recording.meeting_url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recording.platform?.toLowerCase().includes(searchQuery.toLowerCase())
        
        return matchesFilter && matchesSearch
    })

    return (
        <div className="recordings-page">
            {/* ── Filter Bar ── */}
            <div className="recordings-toolbar">
                <div className="toolbar-left">
                    <button 
                        className={`filter-chip ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-chip ${filter === "week" ? "active" : ""}`}
                        onClick={() => setFilter("week")}
                    >
                        This Week
                    </button>
                    <button 
                        className={`filter-chip ${filter === "month" ? "active" : ""}`}
                        onClick={() => setFilter("month")}
                    >
                        This Month
                    </button>
                </div>
                <div className="toolbar-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search recordings…" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Recordings Grid ── */}
            <div className="recordings-grid">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading recordings...</p>
                    </div>
                ) : filteredRecordings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polygon points="10 8 16 12 10 16 10 8" />
                            </svg>
                        </div>
                        <h4>No recordings found</h4>
                        <p>Recordings from your meetings will appear here.</p>
                    </div>
                ) : (
                    filteredRecordings.map((recording) => (
                        <div className="recording-card" key={recording.job_id}>
                            <div className="recording-header">
                                <div className="recording-info">
                                    <h4>Meeting Recording #{recording.job_id}</h4>
                                    <div className="recording-meta">
                                        <span className={`platform-badge platform-${recording.platform}`}>
                                            {recording.platform}
                                        </span>
                                        <span className="recording-date">{formatDate(recording.created_at)}</span>
                                        <span className="recording-duration">{recording.duration || 'N/A'}m</span>
                                        <span className={`status-chip status-${recording.status?.toLowerCase()}`}>
                                            {recording.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="recording-actions">
                                    {recording.status === "Completed" && (
                                        <>
                                            <button 
                                                className="action-btn play-btn"
                                                onClick={() => handlePlay(recording)}
                                                title="Play recording"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="5 3 19 12 5 21 5 3" />
                                                </svg>
                                            </button>
                                            <button 
                                                className="action-btn download-btn"
                                                onClick={() => handleDownload(recording)}
                                                title="Download recording"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="7 10 12 15 17 10" />
                                                    <line x1="12" y1="15" x2="12" y2="3" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="recording-content">
                                <div className="recording-url">
                                    <strong>Meeting URL:</strong> 
                                    <a href={recording.meeting_url} target="_blank" rel="noopener noreferrer">
                                        {recording.meeting_url}
                                    </a>
                                </div>
                                {recording.transcript && (
                                    <div className="recording-transcript">
                                        <strong>Transcript:</strong>
                                        <p>{recording.transcript}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
