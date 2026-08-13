# Instructions for agents

You are working in **cloud-style**, a template for Google Cloud demo and showcase front-ends.
Read this before changing anything.

---

## Read these first, in order

1. **[docs/LAYOUT.md](docs/LAYOUT.md)** — the container-query stage. Non-negotiable; almost every
   way of getting this template wrong is a violation of something on that page.
2. **[docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)** — colour, type, space, motion.
3. **[docs/COMPONENTS.md](docs/COMPONENTS.md)** — markup for each component.

---

## The rules that matter

Ranked by how badly breaking them damages the result.

### 1. No `px` inside `.gc-stage`

Every size is `cqw` — a percentage of the 16:9 stage width — or a token that resolves to one. A
single `px` value stops that element scaling with the rest and will look correct on your screen and
wrong on the projector.

The sanctioned exceptions, all already in the codebase:

| Exception | Why |
|---|---|
| `--gc-shadow-action` | A small physical shadow on a control; scaling it to 3× turns it into a grey smear |
| `--gc-radius-pill: 999px` | A "fully round" sentinel, not a measurement |
| `gc-vt-leave` / `gc-vt-enter` keyframes | `::view-transition-*` pseudo-elements sit in a separate overlay tree outside the stage, so `cqw` doesn't resolve there |
| `@media (max-width: 767px)` / `(min-width: 768px)` | Breakpoints are viewport queries by definition |

```css
/* wrong */  .thing { font-size: 18px; padding: 12px; }
/* right */  .thing { font-size: 1.3cqw; padding: 0.9cqw; }
```

### 2. `container-type` belongs on `.gc-stage` and `.gc-phone` only

Adding it anywhere else silently redefines what `cqw` means for every descendant. This produces
bugs that look like random sizing and take a long time to find.

### 3. One `--gc-blue-action` element per screen

Saturation encodes interactivity in this system. `#1a73e8` means "click this". A second one on the
same screen halves the value of both.

### 4. Match the family to the role

`--gc-font-display` (geometric) for chrome — wordmark, buttons, numbers. `--gc-font-text`
(humanist) for anything read in sentences. Text components must set `font-family` explicitly;
they do not inherit the right one.

### 5. Use tokens, don't hard-code

If you're typing a hex value or a `cqw` number that already exists in `css/tokens.css`, use the
token. If it genuinely doesn't exist, add one — with a comment saying what it's for.

### 6. Keep the frame still

The wordmark, ripple, and footer occupy identical positions on every screen. That is what makes
view transitions read as one continuous surface. Don't move them per-screen.

---

## Common tasks

### Change the content

Edit **`content.js`**. Nothing else. The shape:

```js
CONTENT = {
  brand: { wordmarkBold, wordmarkLight, ledeStrong[], ledeSoft[], cta, edition,
           cardBold, cardLight },
  categories: [
    { icon: 'gc-icon-identity', title: '…',
      facts: [ { title, lede, body, tag, live } ] }
  ]
}
```

Copy limits, because they are layout constraints not style preferences:

| Field | Limit | Why |
|---|---|---|
| `wordmarkBold` + `wordmarkLight` | ~10 chars total | Renders at 10% of screen width |
| `ledeStrong` / `ledeSoft` | 2 lines each, hand-broken | It's a poster, not a paragraph |
| `title` (card) | ~12 words, no full stop | Must fit the card at every size |
| `lede` | one sentence | It's the line the presenter says out loud |
| `body` | ~120 words | It's a slide behind a speaker |
| `categories` | 5–7 | More stops scanning as a menu |

### Add a screen

1. Copy the shell from [COMPONENTS.md § Page shell](docs/COMPONENTS.md#page-shell).
2. Anchor content in `.gc-detail` (`top: 13cqw`) so it aligns with existing screens.
3. Give the changing region a `view-transition-name` from the four that exist: `gc-lede`,
   `gc-cta`, `gc-menu`, `gc-detail`. Adding a new one means adding it to the `::view-transition-*`
   rules in `css/cloud-style.css` §14 — otherwise it won't animate.
4. Add a case to `html()` in `index.html`.

### Add an icon

Append a `<symbol>` to the sprite in `js/gc-icons.js`. 24×24 viewBox, `stroke="currentColor"`,
`fill="none"`, `stroke-width="1.7"`, round caps and joins. Reference it by id from `content.js`.

### Rebrand

Change `--gc-blue-action`, `--gc-blue-brand`, `--gc-blue-header` and the six `--gc-ripple-*` values
in `css/tokens.css`. Keep the ripple ramp opaque and monotonic. Everything else follows.

Leave the Google logotype colours alone — they are brand values.

### Embed a live demo

Put an `<iframe>`, web component, or image inside `.gc-phone-screen`. `.gc-phone` is its own
container, so the demo can size in `cqw` relative to the phone. If the card that opens it pulses
(`.gc-card--live`), the demo must actually be interactive — the pulse is a promise.

---

## Verifying your work

```bash
python3 -m http.server 8000 &
python3 tools/verify.py
```

This screenshots every screen at desktop and mobile into `docs/screenshots/` and **fails on any
console error**. Run it after any change to CSS, JS, or markup.

Requires `pip install playwright && playwright install chromium`.

Then check by eye:

- [ ] Compare against `docs/screenshots/reference-*.png` (captures of the original site).
- [ ] Resize the browser between 1280px and 3840px — the layout must scale, not reflow.
- [ ] At 390×844 it stacks and scrolls with nothing clipped.
- [ ] `grep -n 'px' css/*.css` — every hit should be one of the four exceptions in rule 1.
- [ ] Emulate `prefers-reduced-motion: reduce`; transitions collapse and the pulse stops.

---

## What this template is not

- **Not a component library.** It's a presentation surface with a fixed set of screens. Adding a
  data table or a settings panel means designing something new, not reaching for a variant.
- **Not responsive in the reflow sense.** Desktop scales; mobile is a separate stacked layout.
  There is no tablet-specific state and it doesn't need one.
- **Not framework-coupled.** Plain HTML, CSS, and three small functions. If you port it to React,
  port the CSS as-is and keep the class names — the original was Tailwind arbitrary values, which
  is strictly harder to read and modify.

---

## Provenance

Reconstructed from Google Cloud showcase presentations: the visual system with container-query
units (`cqw`), responsive scaling across desktop and mobile, and computed styles. This template
implements the visual system in plain CSS with semantic class names.

Content in `content.js` is structured from [Google Cloud OnAir](https://cloudonair.withgoogle.com/).
