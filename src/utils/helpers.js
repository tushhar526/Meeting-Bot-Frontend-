/**
 * General-purpose helper utilities.
 * Import individual functions as needed.
 */

/**
 * Format an ISO date string to a short, human-readable string.
 * Returns "—" if the value is falsy.
 * @param {string|null|undefined} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

const MEETING_JOB_IDS_KEY = "meeting_job_ids"

/**
 * Load persisted meeting job IDs from localStorage.
 * @returns {number[]}
 */
export function loadStoredJobIds() {
    try {
        return JSON.parse(localStorage.getItem(MEETING_JOB_IDS_KEY) || "[]")
    } catch {
        return []
    }
}

/**
 * Persist meeting job IDs to localStorage.
 * @param {number[]} ids
 */
export function saveStoredJobIds(ids) {
    localStorage.setItem(MEETING_JOB_IDS_KEY, JSON.stringify(ids))
}

/**
 * Trigger a browser file download from a Blob.
 * @param {Blob} blob
 * @param {string} filename
 */
export function triggerBlobDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
}
