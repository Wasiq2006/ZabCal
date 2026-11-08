/** @type {import("tailwindcss").Config} */
module.exports = {
    "darkMode": "class",
    "theme": {
        "extend": {
            "colors": {
                "surface-bright": "#f9f9ff",
                "primary-container": "#27187e",
                "on-secondary-fixed": "#1a173a",
                "inverse-primary": "#c6c0ff",
                "on-tertiary": "#ffffff",
                "secondary-container": "#d5cffd",
                "on-error-container": "#93000a",
                "surface-container": "#ededf5",
                "tertiary-fixed-dim": "#ffb598",
                "outline-variant": "#c8c4d4",
                "on-surface-variant": "#474552",
                "secondary-fixed-dim": "#c7c1ef",
                "on-surface": "#191b21",
                "surface-tint": "#5a51b2",
                "error-container": "#ffdad6",
                "tertiary-container": "#531a00",
                "inverse-surface": "#2e3036",
                "surface-dim": "#d9d9e1",
                "background": "#f9f9ff",
                "primary": "#12005d",
                "secondary": "#5e5a81",
                "surface-container-lowest": "#ffffff",
                "outline": "#787583",
                "on-secondary-fixed-variant": "#464268",
                "surface-container-low": "#f3f3fb",
                "secondary-fixed": "#e4dfff",
                "on-error": "#ffffff",
                "on-background": "#191b21",
                "tertiary": "#310c00",
                "primary-fixed-dim": "#c6c0ff",
                "on-tertiary-fixed": "#370e00",
                "on-primary-fixed-variant": "#423899",
                "inverse-on-surface": "#f0f0f8",
                "surface-container-highest": "#e2e2ea",
                "surface-container-high": "#e7e7ef",
                "tertiary-fixed": "#ffdbce",
                "on-primary": "#ffffff",
                "on-primary-container": "#9188ed",
                "primary-fixed": "#e4dfff",
                "surface-variant": "#e2e2ea",
                "on-secondary-container": "#5b577e",
                "surface": "#f9f9ff",
                "on-primary-fixed": "#150066",
                "on-secondary": "#ffffff",
                "on-tertiary-container": "#d57d59",
                "error": "#ba1a1a",
                "on-tertiary-fixed-variant": "#763315"
            },
            "borderRadius": {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
            },
            "fontFamily": {
                "headline": [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "SF Pro Display",
                    "Inter",
                    "sans-serif"
                ],
                "body": [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "SF Pro Text",
                    "Inter",
                    "sans-serif"
                ],
                "label": [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "SF Pro Text",
                    "Inter",
                    "sans-serif"
                ]
            }
        }
    },
    "content": [
        "./index.html",
        "./script.js",
        "./Animation.js"
    ],
    "plugins": [
        require("@tailwindcss/forms"),
        require("@tailwindcss/container-queries")
    ]
};
