import { useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const ThemeCssVariables = () => {
    const { theme } = useTheme();

    useEffect(() => {
        const root = document.documentElement;

        // Colors
        root.style.setProperty("--bg-color", theme.colors.background);
        root.style.setProperty("--bg-header", theme.colors.surface);
        root.style.setProperty("--bg-header-alt", theme.colors.surfaceAlt);
        root.style.setProperty("--bg-input", theme.colors.surfaceAlt);

        root.style.setProperty("--color-primary", theme.colors.primary);
        root.style.setProperty("--color-primary-hover", theme.colors.primaryHover);
        root.style.setProperty("--color-accent", theme.colors.accent);
        root.style.setProperty("--color-accent-hover", theme.colors.accentHover);

        root.style.setProperty("--text-primary", theme.colors.textPrimary);
        root.style.setProperty("--text-secondary", theme.colors.textSecondary);
        root.style.setProperty("--border-primary", theme.colors.border);
        root.style.setProperty("--border-secondary", theme.colors.borderLight);

        root.style.setProperty("--radius-sm", theme.radius.sm);
        root.style.setProperty("--radius-md", theme.radius.md);
        root.style.setProperty("--radius-lg", theme.radius.lg);
        root.style.setProperty("--radius-xl", theme.radius.xl);

        // Shadows
        root.style.setProperty("--shadow-soft", theme.shadow.soft);
    }, [theme]);

    return null;
};

export default ThemeCssVariables;