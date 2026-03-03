import { api } from "./fetch"

/**
 * Get all recordings for the current user.
 * @returns {Promise<Array>}
 */
export const getUserRecordings = async () => {
    const response = await api.get("bot/recordings")
    return response.data
}

/**
 * Download the recording for a completed job as a Blob.
 * @param {number} jobId
 * @returns {Promise<Blob>}
 */
export const downloadRecording = async (jobId) => {
    const response = await api.get(`bot/recording/${jobId}`, { responseType: "blob" })
    return response.data
}

/**
 * Stream the recording for playback in browser.
 * @param {number} jobId
 * @returns {Promise<string>} Returns the streaming URL
 */
export const streamRecording = async (jobId) => {
    const response = await api.get(`bot/stream/${jobId}`)
    return response.data.stream_url
}
