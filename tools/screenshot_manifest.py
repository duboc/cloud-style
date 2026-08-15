"""Canonical visual evidence for Cloud Style screens and components."""

SCREENSHOT_CASES = [
    {"name": "hybrid-cover-desktop", "path": "/index.html", "viewport": (1280, 720), "selector": ".gc-stage"},
    {"name": "hybrid-cover-mobile", "path": "/index.html", "viewport": (390, 844), "selector": ".gc-stage", "mobile": True},
    {"name": "hybrid-cover-4k", "path": "/index.html", "viewport": (3840, 2160), "selector": ".gc-stage"},
    {"name": "hybrid-catalog-desktop", "path": "/index.html", "viewport": (1280, 720), "selector": ".gc-stage", "setup": "catalog"},
    {"name": "hybrid-cards-desktop", "path": "/index.html", "viewport": (1280, 720), "selector": ".gc-stage", "setup": "cards"},
    {"name": "hybrid-detail-desktop", "path": "/index.html", "viewport": (1280, 720), "selector": ".gc-stage", "setup": "detail"},
    {"name": "component-buttons-rest", "path": "/templates/06-screen-catalog.html", "viewport": (1280, 720), "selector": "#buttons"},
    {"name": "component-buttons-focus", "path": "/templates/06-screen-catalog.html", "viewport": (1280, 720), "selector": "#buttons", "setup": "focus-primary"},
    {"name": "component-status", "path": "/templates/06-screen-catalog.html", "viewport": (1280, 720), "selector": "#status"},
    {"name": "component-console-surface", "path": "/templates/06-screen-catalog.html", "viewport": (1280, 720), "selector": "#surface"},
    {"name": "demo-image-studio-desktop", "path": "/index.html", "viewport": (1280, 720), "selector": ".gc-phone", "setup": "image-studio"},
    {"name": "demo-image-studio-mobile", "path": "/index.html", "viewport": (390, 844), "selector": ".gc-phone", "setup": "image-studio", "mobile": True},
    {"name": "component-image-studio-compare", "path": "/index.html", "viewport": (1280, 720), "selector": ".gc-phone", "setup": "image-studio-compare"},
    {"name": "component-image-studio-approved", "path": "/index.html", "viewport": (1280, 720), "selector": ".gc-phone", "setup": "image-studio-approved"},
]
