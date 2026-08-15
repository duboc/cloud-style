# Instructions for agents

Cloud Style is a neutral Google Cloud application foundation. The sample app is executable design evidence: reuse its contracts, replace its sample content, and keep the result recognizable as the user's product.

## Read first

1. [docs/LAYOUT.md](docs/LAYOUT.md) — application shell and responsive flow.
2. [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — tokens, typography, color, and motion.
3. [docs/COMPONENTS.md](docs/COMPONENTS.md) — supported component markup and behavior.
4. [docs/ANTIGRAVITY.md](docs/ANTIGRAVITY.md) — create and adopt workflows for Antigravity.

## Non-negotiable rules

### Keep the sample neutral

Visible default content uses Overview, Resources, Activity, Settings, Environments, Operations, and Status. Do not turn the sample into a list of suggested products or industries. Do not restore event, presentation, or device-frame concepts.

### Use the configuration and data boundaries

- Edit `js/config.js` for product identity, project context, and primary navigation.
- Edit `js/data.js` for deterministic sample resources, operations, and form defaults.
- Keep shell markup in `js/app.js`.
- Keep one renderer per route in `js/screens/`.
- Do not put customer content into CSS or component internals.

### Always use Google Sans roles

Use `--gc-font-display` for product names, headings, navigation, controls, and emphasized values. Use `--gc-font-text` for descriptions, tables, forms, and sustained reading. Both stacks start with Google Sans families.

### Use tokens

Use values from `css/tokens.css`. Add a token when a new supported application pattern needs a reusable value. Do not scatter one-off colors, spacing, radii, or shadows through screen styles.

### Preserve action hierarchy

Use Google blue for selection, links, focus, and at most one visible filled primary action per view. Secondary actions use the outlined button. Tertiary actions use text links.

### Preserve behavior when adopting

When applying Cloud Style to an existing application, do not change routes, state, APIs, validation, or public interfaces without separate approval. Convert one representative route, verify it, then continue incrementally.

## File map

| Responsibility | File |
|---|---|
| Product identity and navigation | `js/config.js` |
| Deterministic sample data | `js/data.js` |
| Hash route parsing | `js/router.js` |
| Shell and screen mounting | `js/app.js` |
| Route renderers | `js/screens/*.js` |
| Color, type, spacing, motion | `css/tokens.css` |
| Base elements and shared components | `css/cloud-style.css` |
| Header, navigation, and content shell | `css/shell.css` |
| Screen and workflow styling | `css/screens.css` |
| Mobile and wide-screen adjustments | `css/responsive.css` |
| Runtime and screenshot verification | `tools/verify.py` |

## Verification

Start the repository from its worktree root:

```powershell
python -m http.server 8000
```

In another terminal:

```powershell
python -m unittest discover -s tests -v
python tools/verify.py --update-screenshots
python tools/verify.py
```

Check every PNG in `docs/screenshots/`. At 390x844 the app must stack and scroll without horizontal overflow. At 1280x720 and 3840x2160 it must remain a normal application rather than scale as one fixed composition. Keyboard focus must remain visible, and reduced motion must collapse decorative animation.

## Commit attribution

Commits have one human author. Never add AI co-author or generated-by attribution to commits, pull requests, tags, or merge commits. Stage explicit paths, recheck the active branch and `HEAD` immediately before committing, and preserve unrelated changes.
