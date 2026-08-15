# Antigravity workflows

Use these workflows when pointing Antigravity at Cloud Style. Both workflows preserve the same visual contract; only the starting point changes.

## Create a new application

Give Antigravity this prompt:

```text
Use this repository as the visual foundation for a new Google Cloud application.

Before editing, read AGENTS.md, docs/LAYOUT.md, docs/DESIGN-SYSTEM.md, and docs/COMPONENTS.md. Ask only for missing product decisions: product name, primary routes, core records, primary user action, and required states.

Keep the shell, tokens, Google Sans roles, action hierarchy, focus behavior, and responsive flow. Replace js/config.js and js/data.js with the product identity and deterministic development data. Remove sample routes and components the product does not need. Add one focused renderer per required route. Do not preserve sample screens just because they exist.

Do not create presentation framing, device mockups, event content, or suggested product choices. Run the repository tests and Playwright verifier, refresh canonical screenshots, and inspect every image before reporting completion.
```

Antigravity should produce this sequence:

1. Product decision summary.
2. Route and data map.
3. Sample-route removal list.
4. One working end-to-end route.
5. Remaining routes and states.
6. Automated and visual verification evidence.

## Adopt an existing application

Give Antigravity this prompt:

```text
Apply the Cloud Style visual contract to this existing application without changing its framework, routes, state model, APIs, validation, or public interfaces.

First inventory the current framework, route tree, shared shell, state ownership, reusable components, tests, and accessibility behavior. Read Cloud Style's AGENTS.md, docs/LAYOUT.md, docs/DESIGN-SYSTEM.md, and docs/COMPONENTS.md. Propose a mapping from the existing application to Cloud Style tokens, shell regions, actions, statuses, fields, and states.

Introduce the token layer and fonts first. Convert one representative route while preserving behavior. Run the existing tests plus Cloud Style visual, keyboard, overflow, console, and reduced-motion checks. Show the before/after mapping and screenshot. Continue route by route only after the representative route passes.

Do not replace working product architecture with the sample app's hash router or sample data. Do not rename product concepts to match the sample. Remove obsolete styling only after the migrated route no longer depends on it.
```

Antigravity should stop and request approval if migration requires a framework change, route change, API change, data migration, or new product behavior.

## Verification contract

For either workflow, require:

- One `h1` and a current navigation state per route.
- One visible filled primary action per view at most.
- Google Sans roles applied through tokens.
- Keyboard activation and visible focus.
- Loading, empty, success, warning, and error states where the product needs them.
- No horizontal overflow at 390x844, 1280x720, and 3840x2160.
- Reduced-motion support.
- No browser console or page errors.
- Updated screen and component screenshots reviewed at full size.
