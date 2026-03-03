import { useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./AppLayout.css"

const navItems = [
    {
        label: "Dashboard", path: "/",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
    },
    {
        label: "Meetings", path: "/meetings",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
    },
    {
        label: "Recordings", path: "/recordings",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
    },
    {
        label: "Analytics", path: "/analytics",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
    },
    {
        label: "Settings", path: "/settings",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    },
]

const pageTitles = {
    "/": "Dashboard",
    "/meetings": "Meetings",
    "/recordings": "Recordings",
    "/analytics": "Analytics",
    "/settings": "Settings",
}

export function AppLayout() {
    const { userState, logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const location = useLocation()

    const username = userState?.username || "User"
    const initials = username.slice(0, 2).toUpperCase()
    const pageTitle = pageTitles[location.pathname] || "Dashboard"

    return (
        <div className={`app-layout ${sidebarOpen ? "" : "sidebar-collapsed"}`}>

            {/* ── Sidebar ── */}
            <aside className="app-sidebar">
                <div className="sidebar-brand">
                    <span className="sidebar-logo">Met<span>On</span></span>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(prev => !prev)}
                        aria-label="Toggle sidebar"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {sidebarOpen
                                ? <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>
                                : <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>
                            }
                        </svg>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            className={({ isActive }) =>
                                `sidebar-nav-item ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-nav-item logout-btn" onClick={logout}>
                        <span className="sidebar-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        </span>
                        <span className="sidebar-label">Logout</span>
                    </button>
                </div>
            </aside>

            {/* ── Main area ── */}
            <div className="app-main">

                {/* ── Navbar ── */}
                <header className="app-navbar">
                    <div className="navbar-left">
                        <h1 className="navbar-title">{pageTitle}</h1>
                    </div>

                    <div className="navbar-right">
                        <div className="navbar-search">
                            <svg className="search-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input type="text" placeholder="Search…" />
                        </div>

                        <div className="navbar-profile">
                            <div className="profile-avatar">{initials}</div>
                            <div className="profile-info">
                                <span className="profile-name">{username}</span>
                                <span className="profile-role">Member</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Page content (rendered by child route) ── */}
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
