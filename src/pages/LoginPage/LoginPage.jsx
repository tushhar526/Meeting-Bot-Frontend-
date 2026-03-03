import { Link, useNavigate } from "react-router-dom"
import InputComponent from "../../components/InputComponent/InputComponent"
import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { validateField, validateForm } from "../../utils/validation"
import popup from "../../utils/popup/popup"
import "./LoginPage.css"

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
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

        setTouched({ username: true, password: true });

        const formErrors = validateForm(formData);
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) return;

        const toastId = popup.loading("Logging in…")
        try {
            await login(formData);
            popup.dismiss(toastId)
            popup.success("Welcome back!")
            navigate("/");
        } catch (error) {
            popup.dismiss(toastId)
            popup.error(error?.response?.data?.message || "Invalid credentials. Please try again.")
        }
    };

    return (
        <div className="login-body">

            {/* ── Left: Branding panel ── */}
            <div className="login-brand-panel">
                <div className="login-brand-logo">
                    Met<span>On</span>
                </div>
                <div className="login-brand-content">
                    <h2>Welcome<br />back.</h2>
                    <p>
                        MetOn's AI bot joins your meeting, listens, and records
                        any meeting — so you never miss a thing.
                    </p>
                </div>
                <div className="login-brand-footer">© 2026 MetOn. All rights reserved.</div>
            </div>

            {/* ── Right: Form panel ── */}
            <div className="login-form-panel">
                <div className="login-header">
                    <h2>Log in</h2>
                    <p>Enter your credentials to continue.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="login-inputs">
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
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Your password"
                            error={errors.password}
                        />
                    </div>

                    <div className="login-actions">
                        <button type="submit">Log in</button>
                        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </div>
                </form>
            </div>

        </div>
    );
}
