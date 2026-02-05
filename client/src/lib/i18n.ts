export const getLangFromLocale = (locale?: string[]): "en" | "bn" | undefined => {
    if (!locale) return "en"; // default
    if (locale.length > 1) return undefined; // invalid

    const first = locale[0]?.toLowerCase();
    if (first === "bn") return "bn";
    if (first === "en" || !first) return "en";
    
    return undefined; // invalid value
};
