import { api } from "./fetch"

/**
 * Start a bot for the given meeting URL and platform.
 * @param {string} meeting_url
 * @param {"meet"|"teams"|"zoom"} platform
 * @returns {Promise<{ job_id: number, [key: string]: any }>}
 */
export const startMeeting = async (meeting_url, platform) => {
    const response = await api.post("bot/meeting/start", { meeting_url, platform })
    return response.data
}

/**
 * Get the current status/info of a single meeting job.
 * @param {number} jobId
 */
export const getMeetingStatus = async (jobId) => {
    const response = await api.get(`bot/status/${jobId}`)
    return response.data
}
