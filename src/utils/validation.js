/**
 * Reusable form validation utilities.
 * Import and use these in SignUpPage, LoginPage, or any other form.
 */

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*?]).+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Username: 3–20 chars, letters, numbers, underscores, hyphens
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,50}$/;

/**
 * Validates a single field by name + value.
 * Returns an error string, or "" if valid.
 *
 * @param {"username"|"email"|"password"} field - The field name
 * @param {string} value - The field value
 * @returns {string} Error message or empty string
 */
export function validateField(field, value) {
    switch (field) {
        case "username":
            if (!value.trim()) return "Username is required.";
            if (!USERNAME_REGEX.test(value))
                return "Username must be 3–20 characters (letters, numbers, _ or -).";
            return "";

        case "email":
            if (!value.trim()) return "Email is required.";
            if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address.";
            return "";

        case "password":
            if (!value) return "Password is required.";
            if (value.length < 8) return "Password must be at least 8 characters.";
            if (!PASSWORD_REGEX.test(value))
                return "Password must include uppercase, lowercase, a number, and a special character (!@#$%^&*?).";
            return "";

        default:
            return "";
    }
}

/**
 * Validates an entire form object and returns an errors map.
 * Only validates fields that are present (keys) in the formData object.
 *
 * @param {Object} formData - e.g. { email: "", password: "" }
 * @returns {{ [field: string]: string }} - Map of field → error message
 */
export function validateForm(formData) {
    const errors = {};
    for (const field of Object.keys(formData)) {
        const error = validateField(field, formData[field]);
        if (error) errors[field] = error;
    }
    return errors;
}
