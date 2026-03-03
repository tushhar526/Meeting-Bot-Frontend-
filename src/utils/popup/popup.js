/**
 * Global popup/toast utility powered by Sonner.
 *
 * Usage:
 *   import popup from "../utils/popup/popup"
 *
 *   popup.success("Bot is joining!")
 *   popup.error("Failed to start bot.")
 *   popup.info("Recording is ready.")
 *   popup.warn("Please fill in all fields.")
 *   popup.loading("Sending bot…")          // returns toast id
 *   popup.dismiss(id?)                      // dismiss one or all
 *
 * The <Toaster /> component is mounted once in main.jsx.
 */

import "./popup.css"
import { toast } from "sonner"

const DEFAULT_DURATION = 4000

const popup = {
    /**
     * Show a success toast.
     * @param {string} message
     * @param {import("sonner").ExternalToast} [options]
     */
    success(message, options = {}) {
        return toast.success(message, { duration: DEFAULT_DURATION, ...options })
    },

    /**
     * Show an error toast.
     * @param {string|Error} messageOrError
     * @param {import("sonner").ExternalToast} [options]
     */
    error(messageOrError, options = {}) {
        const message =
            messageOrError instanceof Error
                ? messageOrError.message
                : (messageOrError?.response?.data?.message ?? messageOrError ?? "Something went wrong.")
        return toast.error(message, { duration: 6000, ...options })
    },

    /**
     * Show an info toast.
     * @param {string} message
     * @param {import("sonner").ExternalToast} [options]
     */
    info(message, options = {}) {
        return toast.info(message, { duration: DEFAULT_DURATION, ...options })
    },

    /**
     * Show a warning toast.
     * @param {string} message
     * @param {import("sonner").ExternalToast} [options]
     */
    warn(message, options = {}) {
        return toast.warning(message, { duration: DEFAULT_DURATION, ...options })
    },

    /**
     * Show a persistent loading toast.
     * Store the returned id and pass it to popup.dismiss(id) or use
     * popup.promise() for automatic success/error handling.
     * @param {string} message
     */
    loading(message) {
        return toast.loading(message)
    },

    /**
     * Wrap a promise — automatically shows loading → success/error states.
     * @param {Promise<any>} promise
     * @param {{ loading: string, success: string, error: string }} messages
     */
    promise(promise, { loading, success, error }) {
        return toast.promise(promise, { loading, success, error })
    },

    /**
     * Dismiss a specific toast (by id) or all toasts if no id given.
     * @param {string|number} [id]
     */
    dismiss(id) {
        toast.dismiss(id)
    },
}

export default popup
