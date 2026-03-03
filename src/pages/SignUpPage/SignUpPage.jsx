import { Link, useNavigate } from "react-router-dom"
import InputComponent from "../../components/InputComponent/InputComponent"
import { useState } from "react"
import { signup } from "../../service/auth.service"
import { validateField, validateForm } from "../../utils/validation"
import popup from "../../utils/popup/popup"
import "./SignUpPage.css"

export function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setTouched({ username: true, email: true, password: true });

        const formErrors = validateForm(formData);
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) return;

        const toastId = popup.loading("Creating your account…")
        try {
            await signup(formData);
            popup.dismiss(toastId)
            popup.success("Account created! Please log in.")
            navigate("/login");
        } catch (error) {
            popup.dismiss(toastId)
            popup.error(error?.response?.data?.message || "Signup failed. Please try again.")
        }
    };

    return (
        <div className="signup-body">

            {/* ── Left: Branding panel ── */}
            <div className="signup-brand-panel">
                <div className="signup-brand-logo">
                    Met<span>On</span>
                </div>
                <div className="signup-brand-content">
                    <h2>Joins meeting,<br />effortlessly.</h2>
                    <p>
                        MetOn's AI bot joins your meeting, listens, and records
                        any meeting — so you never miss a thing.
                    </p>
                </div>
                <div className="signup-brand-footer">© 2026 MetOn. All rights reserved.</div>
            </div>

            {/* ── Right: Form panel ── */}
            <div className="signup-form-panel">
                <div className="signup-header">
                    <h2>Create an account</h2>
                    <p>Fill in the details below to get started.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="signup-inputs">
                        <InputComponent
                            label="Username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g. ricardo_julius"
                            error={errors.username}
                        />
                        <InputComponent
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="you@example.com"
                            error={errors.email}
                        />
                        <InputComponent
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Min 8 chars, A-Z, 0-9, !@#…"
                            error={errors.password}
                        />
                    </div>

                    <div className="signup-actions">
                        <button type="submit">Create account</button>
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                    </div>
                </form>
            </div>

        </div>
    );
}