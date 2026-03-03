import { api } from "./fetch"

/**
 * Get comprehensive analytics for the current user's meetings.
 * Endpoint: GET auth/analytics
 * Returns totals, averages, this-week/month counts, by-day breakdown,
 * platform distribution, and last 10 recent meetings.
 */
export const getUserAnalytics = async () => {
    const response = await api.get("users/analytics")
    return response.data
}

/**
 * Get daily meeting trend data over a rolling window.
 * Endpoint: GET auth/analytics/trends?days=<days>
 * @param {number} days - Number of days to look back (default 30)
 */
export const getMeetingTrends = async (days = 30) => {
    const response = await api.get(`users/analytics/trends?days=${days}`)
    return response.data
}

/**
 * Permanently delete the current user's account and all associated data.
 * Endpoint: DELETE auth/account
 */
export const deleteUserAccount = async () => {
    const response = await api.delete("users/account")
    return response.data
}
