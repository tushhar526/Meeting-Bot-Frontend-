import "./LoadingPage.css"

export function LoadingPage() {
    return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Verifying Session...</p>
        </div>
    )
}