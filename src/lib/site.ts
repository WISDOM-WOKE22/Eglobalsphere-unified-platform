export const siteConfig = {
    name: "eGlobalSphere Unified Platform",
    description: "Unified platform for managing global operations, employee logs, and license plate recognition.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ogImage: "https://eglobalsphere.com/og-image.jpg", // Replace with actual default OG image URL if available
    links: {
        twitter: "https://twitter.com/eglobalsphere",
        github: "https://github.com/eglobalsphere",
    },
    keywords: [
        "eGlobalSphere",
        "Unified Platform",
        "Management",
        "Operations",
        "LPR",
        "Employee Logs"
    ]
};

export type SiteConfig = typeof siteConfig;
