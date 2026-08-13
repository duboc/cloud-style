# Design system

Everything here is declared in [`css/tokens.css`](../css/tokens.css). This page explains what each
token is *for*, which is the part you can't read off a hex value.

---

## Colour

### The single blue, at six jobs

The identity is one hue doing different work. Picking the wrong shade is the most common way to
make something look almost-right-but-off.

| Token | Hex | Use it for | Never |
|---|---|---|---|
| `--gc-blue-action` | `#1a73e8` | Primary buttons, circular nav buttons | Text, backgrounds |
| `--gc-blue-action-hover` | `#1666d0` | Hover/pressed of the above | Anything at rest |
| `--gc-blue-brand` | `#3f7ae8` | Headings, breadcrumbs, menu labels, PWA theme | Buttons |
| `--gc-blue-glyph` | `#4f86e8` | Icon strokes inside tinted tiles | Text |
| `--gc-blue-header` | `#4d8bf5` | Card header bars, tag chips | Body text |
| `--gc-blue-numeral` | `#a9c2f0` | The `01` `02` ordinals | Anything you must read |

The rule behind the table: **saturation encodes interactivity.** `#1a73e8` is the most saturated
thing on any screen and it is always clickable. `#a9c2f0` is nearly washed out and is always inert
decoration. If a colour's saturation doesn't match its behaviour, users mis-click.

> There is exactly **one** `--gc-blue-action` element on the cover. That is the whole point of the
> cover.

### Blue tints — surfaces

Lighter means further back. These are backgrounds only; never set text in them.

| Token | Hex | Surface |
|---|---|---|
| `--gc-blue-tint-100` | `#e2e9fc` | Icon tile behind a glyph |
| `--gc-blue-tint-090` | `#e6edfc` | Menu row, hovered |
| `--gc-blue-tint-080` | `#eaf0fd` | Fact card body |
| `--gc-blue-tint-070` | `#eff3fd` | Menu row, at rest |
| `--gc-blue-tint-060` | `#f2f6fe` | Panel / chat title bar |
| `--gc-blue-tint-050` | `#f4f8fe` | Outermost ripple ring |

### Ripple ramp

Six rings, outermost to innermost. Each roughly doubles the saturation of the last; the innermost
is Google Blue 300.

| Ring | Token | Hex | Size (× stage width) |
|---|---|---|---|
| 1 (outer) | `--gc-ripple-01` | `#f4f8fe` | 0.780 |
| 2 | `--gc-ripple-02` | `#e9f1fe` | 0.640 |
| 3 | `--gc-ripple-03` | `#dae8fd` | 0.500 |
| 4 | `--gc-ripple-04` | `#c6dafb` | 0.370 |
| 5 | `--gc-ripple-05` | `#abc9fa` | 0.250 |
| 6 (core) | `--gc-ripple-06` | `#8ab4f8` | 0.125 |

They are opaque, not translucent. Stacking six semi-transparent circles gives you muddy overlaps
and a different result on every background.

### Ink

| Token | Hex | Use |
|---|---|---|
| `--gc-ink-900` | `#1f2329` | **Wordmark only.** Nothing else on the page is this dark. |
| `--gc-ink-800` | `#2a2f3a` | Bold lede lines on the cover |
| `--gc-ink-700` | `#3f4654` | Regular lede lines |
| `--gc-ink-600` | `#3c4043` | Card titles, article headline |
| `--gc-ink-550` | `#444746` | Icon buttons on neutral surfaces |
| `--gc-ink-500` | `#5f6368` | Body copy, captions, "Cloud" in the footer |
| `--gc-ink-450` | `#747775` | Input placeholder |
| `--gc-ink-400` | `#9aa0a6` | Disabled |

Reserving `--gc-ink-900` for the wordmark is deliberate: it makes the logo the darkest object in
the composition without needing to be the biggest thing you notice after the ripple.

### Google logotype

Per-letter spans. **These are brand values — do not substitute, tint, or approximate.**

| Letter | Token | Hex |
|---|---|---|
| **G** | `--gc-google-blue` | `#4285f4` |
| **o** | `--gc-google-red` | `#ea4335` |
| **o** | `--gc-google-yellow` | `#fbbc05` |
| **g** | `--gc-google-blue` | `#4285f4` |
| **l** | `--gc-google-green` | `#34a853` |
| **e** | `--gc-google-red` | `#ea4335` |

"Cloud" that follows is `--gc-ink-500`, weight 500, offset by `0.7cqw`.

### Semantic

Each is a foreground paired with its tint. Use for status circles, badges, callouts.

| State | Foreground | Background |
|---|---|---|
| Success | `#188038` | `#e0f2e7` |
| Error | `#b3261e` | `#fde7e5` |
| Error (alt) | `#c5221f` | `#fce8e6` |
| Warning | `#b06000` | `#fef3d9` |
| Accent | `#7627bb` | `#f0e6fd` |

---

## Typography

### Two families, split by role

```css
--gc-font-display: "Google Sans", "Product Sans", Poppins, "Helvetica Neue", Arial, sans-serif;
--gc-font-text:    "Google Sans Text", "DM Sans", Roboto, "Helvetica Neue", Arial, sans-serif;
```

| | Family | Use for |
|---|---|---|
| **Display** | Google Sans (geometric) | Wordmark, buttons, numbers, chrome — anything you *recognise* rather than read |
| **Text** | Google Sans Text (humanist) | Menu labels, card titles, article prose — anything you read in sentences |

Geometric faces have even, circular letterforms that look sharp at large sizes and get tiring at
small ones. Humanist faces have varied stroke widths and open apertures that stay legible small.
Using one for both jobs is what makes a deck look generic.

The split is enforced in CSS: `.gc-stage` sets display; every text component explicitly sets
`font-family: var(--gc-font-text)`.

### Licensing

Google Sans and Google Sans Text serve publicly from `fonts.googleapis.com`, and the templates load
them. They are Google **brand** fonts — appropriate for Google Cloud demos, internal decks, and
partner material presented as Google content; **not** licensed for general third-party product use.

To drop them, remove `Google+Sans` and `Google+Sans+Text` from the `<link>` in your HTML. The stack
falls through to Poppins and DM Sans with no other change. That fallback is what the original deck
actually renders as on any non-Google machine, so it is a tested path, not a guess.

### Scale

Desktop values are `cqw` — percentages of stage width. Mobile values are effectively `vw`
(see [LAYOUT.md](LAYOUT.md#the-mobile-trick)).

| Token | Desktop | Mobile | Weight | Family | Element |
|---|---|---|---|---|---|
| `--gc-text-wordmark` | `10cqw` | `13cqw` | 700 / 400 | display | The lockup |
| `--gc-text-lede` | `2.5cqw` | `6.8cqw` | 700 / 400 | text | Cover claim |
| `--gc-text-title` | `2cqw` | `5.6cqw` | 600 | text | Article headline |
| `--gc-text-card-head` | `1.7cqw` | `5.2cqw` | 700 / 400 | display | "finfact" in a card |
| `--gc-text-heading` | `1.6cqw` | `4.3cqw` | 700 | text | Breadcrumb title |
| `--gc-text-logo` | `1.65cqw` | `4.4cqw` | 500 | display | Google Cloud lockup |
| `--gc-text-label` | `1.4cqw` | `4.1cqw` | 600 | text | Menu row label |
| `--gc-text-body-lg` | `1.3cqw` | `4.1cqw` | 600 / 500 | text | Card title, article lede, buttons |
| `--gc-text-meta` | `1.3cqw` | `3.5cqw` | 400 | display | Edition line |
| `--gc-text-body` | `1.05cqw` | `3.7cqw` | 400 | text | Article prose |
| `--gc-text-caption` | `0.95cqw` | `3.1cqw` | 600 | text | Tag chips |

### Line height

Tighter as text gets bigger. Display type needs no room to breathe; prose does.

| Role | `line-height` |
|---|---|
| Wordmark | `1` (plus `letter-spacing: -0.025em`) |
| Lede, article headline | `1.3` |
| Menu label, breadcrumb | `1.25` |
| Card title | `1.35` |
| Article lede | `1.4` |
| Article prose | `1.7` |

### Weights

`400` regular · `500` medium · `600` semibold · `700` bold. No others; there is no `300` or `800`
in this system.

The wordmark is the one place two weights sit in a single word: **bold** half is the product name,
regular half is the category. The same device repeats in miniature on every card header, which is
what ties a detail card back to the brand without repeating the logo.

---

## Space

| Token | Desktop | Mobile | Meaning |
|---|---|---|---|
| `--gc-gutter` | `3.3cqw` | `6cqw` | Left margin for structural elements |
| `--gc-gutter-text` | `3.5cqw` | `6cqw` | Left margin for text |
| `--gc-gap-row` | `1.05cqw` | `3cqw` | Between menu rows |
| `--gc-gap-card` | `1.5cqw` | `4cqw` | Between fact cards |
| `--gc-measure` | `50cqw` | `100%` | Max line length for prose |

The two gutters differ by `0.2cqw`. That is not a mistake — it is an optical correction. Text has
side bearings built into the glyphs, so type set to the same left edge as a solid box appears
indented. Nudging text `0.2cqw` further left makes the two align *visually*.

`--gc-measure` at `50cqw` keeps prose to roughly 75 characters while leaving the right half of the
stage for the device mock.

### Vertical anchors (desktop)

These are fixed per screen. Keeping them constant is what lets screens cross-fade in place.

| Element | Position |
|---|---|
| Wordmark | `top: 3.2cqw`, `left: 3.3cqw` |
| Cover lede | `top: 20cqw` |
| Cover CTA | `top: 36cqw` |
| Menu block | `top: 18cqw`, `width: 42cqw` |
| Detail block | `top: 13cqw`, `left: 3.3cqw`, `right: 1cqw` |
| Device slot | `right: 6cqw`, vertically centred |
| Footer logo | `bottom: 3.2cqw` |
| Edition line | `bottom: 3.35cqw`, `left: 18.7cqw` |

### Radii

| Token | Desktop | Mobile | On |
|---|---|---|---|
| `--gc-radius-tile` | `0.8cqw` | `2.6cqw` | Icon tiles |
| `--gc-radius-row` | `1.05cqw` | `3.6cqw` | Menu rows |
| `--gc-radius-card` | `1.1cqw` | `3.4cqw` | Fact cards |
| `--gc-radius-device` | `2.6cqw` | `10cqw` | Phone frame |
| `--gc-radius-pill` | `999px` | — | Buttons, tag chips |

Radii scale with the elements they round. A `1.1cqw` corner on a `18cqw` card and a `0.8cqw` corner
on a `3.3cqw` tile are the *same relative softness* — which is why they look like one family.

---

## Elevation

Shadows inside the stage use `cqw`, so they scale with everything else.

| Token | Value | On |
|---|---|---|
| `--gc-shadow-action` | `0 3px 10px rgba(26,115,232,.22)` | Buttons — **the one `px` exception** |
| `--gc-shadow-card` | `0 .2cqw .6cqw rgba(31,35,41,.10)` | Fact cards |
| `--gc-shadow-device` | `0 .8cqw 2.5cqw rgba(31,35,41,.08)` | Phone frame |
| `--gc-shadow-soft` | `0 0 .74cqw 0 rgba(0,0,0,.10)` | Floating panels |
| `--gc-shadow-overlay` | `0 1.38cqw 5.53cqw rgba(0,0,0,.22)` | Modals |
| `--gc-shadow-sheet` | `0 -1.15cqw 4.61cqw rgba(31,31,31,.16)` | Bottom sheets (upward) |

Button shadows are blue-tinted (`rgba(26,115,232,…)`), not grey. A coloured shadow reads as the
object glowing rather than casting, which is what makes the CTA feel active. Card shadows are
neutral and nearly invisible — they separate, they don't lift.

`--gc-shadow-action` stays in `px` because a small physical shadow on a control turns into a grey
smear when multiplied by 3 on a 4K display.

---

## Motion

```css
--gc-ease-exit:  cubic-bezier(0.4, 0, 1, 1);      --gc-dur-exit:  0.10s;
--gc-ease-enter: cubic-bezier(0.22, 1, 0.36, 1);  --gc-dur-enter: 0.18s;
--gc-dur-hover:  0.15s;
```

Motion here is **asymmetric on purpose**: leaving is fast and accelerating (get out of the way),
entering is slower and decelerating (arrive and settle). Total under 300ms, so navigating never
feels like waiting.

| Animation | Duration | What |
|---|---|---|
| `gc-vt-leave` | 100ms | Fade out + `translateY(-6px)` |
| `gc-vt-enter` | 180ms | Fade in from `translateY(10px)` |
| `gc-pulse` | 1.1s loop | Ring on cards that open a live demo |
| Hover | 150ms | Background colour only |

Named view-transition regions: `gc-lede`, `gc-cta`, `gc-menu`, `gc-detail`. The `root` snapshot is
explicitly `animation: none`, which is what keeps the wordmark and ripple perfectly still while
content changes.

`prefers-reduced-motion: reduce` collapses transitions to `0.01s` linear and stops the pulse. This
is handled in CSS — you don't need to do anything.

---

## Checks before you ship

- [ ] No `px` anywhere inside `.gc-stage`. The four sanctioned exceptions are `--gc-shadow-action`,
      `--gc-radius-pill`, the view-transition keyframes, and the media-query breakpoints —
      see [AGENTS.md](../AGENTS.md#1-no-px-inside-gc-stage).
- [ ] Exactly one `--gc-blue-action` element per screen.
- [ ] Prose uses `--gc-font-text`; chrome uses `--gc-font-display`.
- [ ] `--gc-ink-900` appears only on the wordmark.
- [ ] Google logotype colours are exact.
- [ ] Renders identically at 1280×720 and 3840×2160 (scaled).
- [ ] Mobile at 390×844 stacks and scrolls, nothing clipped.
- [ ] Reduced-motion respected.
