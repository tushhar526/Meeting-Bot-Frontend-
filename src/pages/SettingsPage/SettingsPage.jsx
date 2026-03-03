import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../utils/Themes/ThemeProvider"
import { deleteUserAccount } from "../../service/analytics.service"
import popup from "../../utils/popup/popup"
import "./SettingsPage.css"

const themeOptions = [
    { key: "night", label: "Night", desc: "Dark teal — easy on the eyes", palette: ["#01161E", "#124559", "#598392", "#EFF6E0"] },
    { key: "day", label: "Day", desc: "Warm & vibrant — sunny vibes", palette: ["#FFF7ED", "#DC2F02", "#FFBA08", "#03071E"] },
    { key: "normal", label: "Normal", desc: "Fresh green — calm & natural", palette: ["#F4FBF6", "#40916C", "#95D5B2", "#081C15"] },
    { key: "mono", label: "Mono", desc: "Black & white — sharp & minimal", palette: ["#0A0A0A", "#1F1F1F", "#A3A3A3", "#F5F5F5"] },
]

export function SettingsPage() {
    const { userState, logout } = useAuth()
    const { currentTheme, setTheme } = useTheme()
    const username = userState?.username || "User"
    const email = userState?.email || "—"
    const initials = username.slice(0, 2).toUpperCase()

    const handleDeleteAccount = async () => {
        if (!window.confirm("This will permanently delete your account and all data. Continue?")) return
        const toastId = popup.loading("Deleting account…")
        try {
            await deleteUserAccount()
            popup.dismiss(toastId)
            popup.success("Account deleted.")
            logout()
        } catch {
            popup.dismiss(toastId)
            popup.error("Failed to delete account. Please try again.")
        }
    }

    return (
        <div className="settings-page">
            {/* ── Profile Section ── */}
            <section className="settings-card">
                <h3 className="settings-card-title">Profile</h3>
                <div className="profile-section">
                    <div className="settings-avatar">{initials}</div>
                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="detail-label">Username</span>
                            <span className="detail-value">{username}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{email}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Theme Chooser ── */}
            <section className="settings-card">
                <h3 className="settings-card-title">Theme</h3>
                <div className="theme-grid">
                    {themeOptions.map((t) => (
                        <button
                            key={t.key}
                            className={`theme-option ${currentTheme === t.key ? "selected" : ""}`}
                            onClick={() => setTheme(t.key)}
                        >
                            <div className="theme-palette">
                                {t.palette.map((color, i) => (
                                    <div
                                        key={i}
                                        className="palette-swatch"
                                        style={{ background: color }}
                                    />
                                ))}
                            </div>
                            <div className="theme-meta">
                                <span className="theme-name">{t.label}</span>
                                <span className="theme-desc">{t.desc}</span>
                            </div>
                            {currentTheme === t.key && (
                                <div className="theme-check">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Preferences ── */}
            <section className="settings-card">
                <h3 className="settings-card-title">Preferences</h3>
                <div className="pref-list">
                    <div className="pref-item">
                        <div className="pref-info">
                            <span className="pref-name">Email Notifications</span>
                            <span className="pref-desc">Receive email when a recording is ready</span>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                    <div className="pref-item">
                        <div className="pref-info">
                            <span className="pref-name">Auto-Record</span>
                            <span className="pref-desc">Automatically start recording when bot joins</span>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                </div>
            </section>

            {/* ── Danger Zone ── */}
            <section className="settings-card danger-zone">
                <h3 className="settings-card-title">Danger Zone</h3>
                <div className="danger-content">
                    <div className="danger-info">
                        <span className="danger-name">Delete Account</span>
                        <span className="danger-desc">Permanently delete your account and all data.</span>
                    </div>
                    <button className="danger-btn" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </section>
        </div>
    )
}
