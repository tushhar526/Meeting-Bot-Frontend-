import { useState } from "react";
import "./InputComponent.css";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const InputComponent = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="input-container">
      {label && <label className="input-label" htmlFor={name}>{label}</label>}
      <div className={`input-wrapper${isPassword ? " input-password-wrapper" : ""}`}>
        <input
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="off"
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field ${error ? "input-error" : ""} ${disabled ? "input-disabled" : ""} ${isPassword ? "input-has-toggle" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            className="input-eye-toggle"
            onClick={() => setShowPassword(prev => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      <div className={`input-error-wrapper${error ? " active" : ""}`}>
        <p className="input-error-message">{error || ""}</p>
      </div>
    </div>
  );
};

export default InputComponent;
