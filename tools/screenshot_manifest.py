"""Canonical visual evidence for the neutral Google Cloud application."""

SCREENSHOT_CASES = [
    {"name": "app-overview-desktop", "path": "/index.html#/overview", "viewport": (1280, 720), "selector": ".gc-app", "full_page": True},
    {"name": "app-overview-4k", "path": "/index.html#/overview", "viewport": (3840, 2160), "selector": ".gc-app", "full_page": True},
    {"name": "app-overview-mobile", "path": "/index.html#/overview", "viewport": (390, 844), "selector": ".gc-app", "full_page": True, "mobile": True},
    {"name": "app-resources-desktop", "path": "/index.html#/resources", "viewport": (1280, 720), "selector": ".gc-app", "full_page": True},
    {"name": "app-resources-mobile", "path": "/index.html#/resources", "viewport": (390, 844), "selector": ".gc-app", "full_page": True, "mobile": True},
    {"name": "app-resource-detail-desktop", "path": "/index.html#/resources/edge-gateway", "viewport": (1280, 720), "selector": ".gc-app", "full_page": True},
    {"name": "app-activity-states", "path": "/components.html", "viewport": (1280, 900), "selector": "#activity-states"},
    {"name": "app-settings-validation", "path": "/index.html#/settings", "viewport": (1280, 720), "selector": ".gc-app", "full_page": True, "setup": "settings-invalid"},
    {"name": "components-app-surfaces", "path": "/components.html", "viewport": (1280, 900), "selector": ".gc-component-page", "full_page": True},
]
