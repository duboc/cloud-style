# Design system

All reusable values are declared in `css/tokens.css`. Components consume semantic roles rather than raw palette values.

## Typography

Cloud Style always starts with Google Sans families:

```css
--gc-font-display: "Google Sans", "Product Sans", Arial, sans-serif;
--gc-font-text: "Google Sans Text", "Google Sans", Roboto, Arial, sans-serif;
```

Use the display family for product identity, headings, navigation, buttons, tabs, statuses, and emphasized values. Use the text family for descriptions, resource data, activity, help text, and form content.

Headings use medium weights and compact line height. Body text uses normal application sizes. Do not enlarge headings to fill empty space.

## Color

Official Google colors are reserved for the top signature, product mark, and Super Cloud artwork. The primary interaction blue is `--gc-blue-action`.

| Role | Token | Use |
|---|---|---|
| Primary action | `--gc-blue-action` | One filled action per view |
| Current selection | `--gc-blue-selection` | Navigation and quiet selected states |
| Canvas | `--gc-surface-canvas` | Application background |
| Panel | `--gc-surface` | Working surfaces |
| Divider | `--gc-border-subtle` | Panel, row, and shell separation |
| Text | `--gc-ink`, `--gc-ink-muted` | Body and supporting content |
| Success | `--gc-success`, `--gc-success-bg` | Healthy outcomes |
| Warning | `--gc-warning`, `--gc-warning-bg` | Attention without failure |
| Error | `--gc-error`, `--gc-error-bg` | Failed operations and validation |

Saturation encodes interaction. Do not use filled Google blue as decoration.

## Space and density

The spacing scale runs from `--gc-space-1` through `--gc-space-12`. Tables and activity rows use compact vertical spacing. Page sections and unrelated panels use larger gaps. Console-like density means showing useful structure without compressing labels, help text, or targets.

## Shape and elevation

- Pills communicate actions, selection, or compact status.
- Panels use `--gc-radius-lg`, a quiet border, and nearly flat elevation.
- Fields use `--gc-radius-sm`.
- Dialogs use stronger elevation because they interrupt the application layer.

Avoid nested cards when a divider or definition list communicates the relationship.

## Focus and motion

All interactive elements expose `:focus-visible` through `--gc-focus-ring`. Selected navigation never replaces keyboard focus.

Transitions are short and limited to hover or state changes. `prefers-reduced-motion: reduce` collapses transitions and the loading spinner animation.

## Action hierarchy

1. Filled blue: the one primary action in the current view.
2. Outlined: secondary or cancel actions.
3. Text link: navigation or tertiary action.

When a dialog opens, its visible primary action becomes the current action. The page behind it is inert to the user.
