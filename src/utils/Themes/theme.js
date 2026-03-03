export const nightTheme = {
    colors: {
        background: "#01161E",
        surface: "#0B2A33",
        surfaceAlt: "#124559",

        primary: "#124559",
        primaryHover: "#0E3B4A",
        accent: "#598392",
        accentHover: "#C1D3C0",

        textPrimary: "#EFF6E0",
        textSecondary: "#AEC3B0",
        textMuted: "#598392",

        border: "#EFF6E0",
        borderLight: "#F4F9EA"
    },

    effects: {
        vantaFog: {
            base: "#598392",
            midtone: "#0E3B4A",
            highlight: "#124559",
        },
    },

    radius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "24px",
    },

    shadow: {
        soft: "0 6px 24px rgba(0,0,0,0.35)",
        strong: "0 12px 40px rgba(0,0,0,0.5)",
    },
};

export const dayTheme = {
    colors: {
        background: "#FFF7ED",
        surface: "#FFFFFF",
        surfaceAlt: "#FFEDD5",

        primary: "#DC2F02",
        primaryHover: "#D00000",
        accent: "#FFBA08",
        accentHover: "#FFCA3A",

        textPrimary: "#03071E",
        textSecondary: "#6A040F",
        textMuted: "#9D0208",

        border: "#03071E",
        borderLight: "#0A1033"
    },

    effects: {
        vantaFog: {
            base: "#FFF7ED",
            midtone: "#DC2F02",
            highlight: "#FFBA08",
        }
    },

    radius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "24px",
    },

    shadow: {
        soft: "0 4px 20px rgba(220,47,2,0.15)",
        strong: "0 8px 30px rgba(220,47,2,0.25)",
    },
};

export const normalTheme = {
    colors: {
        background: "#F4FBF6",
        surface: "#FEFFFE",
        surfaceAlt: "#D8F3DC",

        primary: "#40916C",
        primaryHover: "#2D6A4F",
        accent: "#95D5B2",
        accentHover: "#B7E4C7",

        textPrimary: "#081C15",
        textSecondary: "#1B4332",
        textMuted: "#52B788",

        border: "#081C15",
        borderLight: "#0F2E23"
    },

    effects: {
        vantaFog: {
            base: "#40916C",
            midtone: "#95D5B2",
            highlight: "#D8F3DC",
        }
    },

    radius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "24px",
    },

    shadow: {
        soft: "0 4px 20px rgba(64,145,108,0.15)",
        strong: "0 8px 30px rgba(64,145,108,0.25)",
    },
};

export const monoTheme = {
    colors: {
        background: "#0A0A0A",
        surface: "#1A1A1A",
        surfaceAlt: "#2A2A2A",

        primary: "#1F1F1F",
        primaryHover: "#2E2E2E",
        accent: "#D4D4D4",
        accentHover: "#FFFFFF",

        textPrimary: "#F5F5F5",
        textSecondary: "#A3A3A3",
        textMuted: "#6B6B6B",

        border: "#3A3A3A",
        borderLight: "#2E2E2E",
    },

    effects: {
        vantaFog: {
            base: "#0A0A0A",
            midtone: "#1F1F1F",
            highlight: "#3A3A3A",
        },
    },

    radius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "24px",
    },

    shadow: {
        soft: "0 6px 24px rgba(0,0,0,0.6)",
        strong: "0 12px 40px rgba(0,0,0,0.8)",
    },
};

export const hexToVanta = (hex) =>
    Number(hex.replace("#", "0x"));

export const themes = {
    night: nightTheme,
    day: dayTheme,
    normal: normalTheme,
    mono: monoTheme,
};