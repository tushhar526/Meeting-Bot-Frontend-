import { createContext, useContext, useState, useEffect } from "react";
import { themes } from "./theme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState("mono");

    useEffect(() => {
        const saved = localStorage.getItem("app-theme");
        if (saved && themes[saved]) {
            setCurrentTheme(saved);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("app-theme", currentTheme);
    }, [currentTheme]);

    const value = {
        theme: themes[currentTheme],
        currentTheme,
        setTheme: setCurrentTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);

    if (!ctx) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return ctx;
};