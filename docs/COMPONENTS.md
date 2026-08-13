# Components

Every component in the system: the markup, the tokens it uses, and the rules that keep it looking
right. Class prefix is `gc-` throughout.

Defined in [`css/cloud-style.css`](../css/cloud-style.css). Sizes come from
[`css/tokens.css`](../css/tokens.css).

---

## Page shell

Every screen has the same three-layer skeleton. Copy this and fill in the middle.

```html
<div class="gc-cover">

  <!-- 1. Background, z-0 -->
  <div class="gc-ripple" aria-hidden="true">
    <i></i><i></i><i></i><i></i><i></i><i></i>
  </div>

  <!-- 2. Optional veil, z-5 — on dense screens only -->
  <div class="gc-veil" aria-hidden="true"></div>

  <!-- 3. Content, z-10 -->
  <div class="gc-stage">
    <div class="gc-wordmark">…</div>
    <!-- screen content -->
    <div class="gc-footer">…</div>
  </div>

</div>
```

**Rules**

- `.gc-cover` owns `--s`, `--h`, `--top`. Do not set them anywhere else.
- `.gc-stage` is the container query root. Do not add `container-type` to anything inside it
  except `.gc-phone`.
- The ripple is always exactly six `<i>` elements, always `aria-hidden`.
- Use the veil on the card rail and article screens; leave it off the cover and menu.

---

## Ripple

```html
<div class="gc-ripple" aria-hidden="true">
  <i></i><i></i><i></i><i></i><i></i><i></i>
</div>
```

Six concentric circles sharing one centre, anchored to the stage: 18% of stage width in from the
right, 71% of the way down. Sizes and colours come entirely from CSS `nth-child`.

**Rules**

- Exactly six. Fewer and the gradient reads as banding; more and it turns into a target.
- Opaque fills, never `opacity`. Stacked transparency muddies the overlaps.
- `pointer-events: none` — it must never eat a click.
- Nothing in the content layer should overlap the inner two rings.

To retint, change `--gc-ripple-01` … `--gc-ripple-06`. Keep them opaque and keep the progression
monotonic.

---

## Wordmark

```html
<div class="gc-wordmark">
  <h1><b>fin</b><span>facts</span></h1>
</div>
```

With an optional badge (used on the article screen to toggle a live demo):

```html
<div class="gc-wordmark">
  <h1><b>fin</b><span>facts</span></h1>
  <button class="gc-wordmark-badge" aria-label="Toggle live demo">
    <svg><use href="#gc-icon-cloud"/></svg>
  </button>
</div>
```

| Property | Value |
|---|---|
| Size | `--gc-text-wordmark` — `10cqw` / `13cqw` |
| Family | `--gc-font-display` |
| Weights | `700` bold half, `400` light half |
| Colour | `--gc-ink-900` — the only element that uses it |
| Tracking | `-0.025em` |
| Line height | `1` |
| Position | `left: 3.3cqw`, `top: 3.2cqw` |

**Rules**

- One word, split into two weights. Bold = product name, regular = category. Never a space between
  them, never two separate words.
- Keep it under ~10 characters. It renders at 10% of screen width.
- It is a link home. Wire a click handler; it costs nothing and users expect it.
- It never moves between screens. That fixed position is what makes navigation feel continuous.

---

## Cover lede

```html
<div class="gc-lede" style="view-transition-name: gc-lede">
  <p class="is-strong">Discoveries</p>
  <p class="is-strong">and opportunities</p>
  <p class="is-soft">that add value to</p>
  <p class="is-soft">financial services</p>
</div>
```

| | Weight | Colour |
|---|---|---|
| `.is-strong` | 700 | `--gc-ink-800` |
| `.is-soft` | 400 | `--gc-ink-700` |

**Rules**

- Four lines, broken by hand. This is a poster, not a paragraph — do not let it wrap on its own.
- Two bold then two regular. Bold carries the claim; regular carries the qualifier. Bolding all
  four destroys the hierarchy and the effect.
- Set `view-transition-name: gc-lede` so it cross-fades out when navigating.

---

## Buttons

### Primary pill

```html
<button class="gc-btn">See how we can help</button>

<!-- On the cover, absolutely positioned: -->
<button class="gc-btn gc-btn--cover" style="view-transition-name: gc-cta">
  See how we can help
</button>
```

| Property | Value |
|---|---|
| Background | `--gc-blue-action` → `--gc-blue-action-hover` |
| Padding | `0.9cqw 2.1cqw` |
| Size / weight | `--gc-text-body-lg` / `500` |
| Radius | `--gc-radius-pill` |
| Shadow | `--gc-shadow-action` (blue-tinted) |

**Rules**

- One per screen. The saturated blue is the system's only "this is the thing to click" signal;
  a second one halves its value.
- Sentence case, no terminal punctuation.
- Drop `.gc-btn--cover` if you're placing it in normal flow.

### Circular icon button

```html
<button class="gc-icon-btn" aria-label="Home">
  <svg><use href="#gc-icon-home"/></svg>
</button>

<!-- Neutral variant, for secondary controls on white -->
<button class="gc-icon-btn gc-icon-btn--neutral" aria-label="Previous">
  <svg><use href="#gc-icon-back"/></svg>
</button>
```

`2.7cqw` circle (`9.5cqw` mobile), `1.4cqw` glyph. Blue variant carries `--gc-shadow-action`;
neutral has none.

**Rules**

- Always give it an `aria-label`. There is no text.
- Blue = navigation. Neutral = everything else.

---

## Icon tile

The rounded square that holds a category glyph.

```html
<span class="gc-icon-tile">
  <svg><use href="#gc-icon-identity"/></svg>
</span>

<!-- Smaller variant, for breadcrumbs -->
<span class="gc-icon-tile gc-icon-tile--sm">
  <svg><use href="#gc-icon-identity"/></svg>
</span>
```

| | Tile | Glyph | Radius |
|---|---|---|---|
| Default | `3.3cqw` | `1.8cqw` | `--gc-radius-tile` |
| `--sm` | `2.9cqw` | `1.8cqw` | `0.7cqw` |

Background `--gc-blue-tint-100`, glyph `--gc-blue-glyph` via `currentColor`.

**Rules**

- A category keeps its glyph forever. The same icon appears in the menu row, the card-rail
  breadcrumb, and the article breadcrumb — that repetition is how the user tracks where they are.
- Tiles are decorative when a label sits beside them. Don't add alt text; don't make them focusable.

---

## Menu

```html
<nav class="gc-menu" style="view-transition-name: gc-menu">

  <button class="gc-menu-item">
    <span class="gc-icon-tile"><svg><use href="#gc-icon-identity"/></svg></span>
    <span class="gc-menu-label">Onboarding, document upload and approval</span>
    <span class="gc-menu-num">01</span>
  </button>

  <!-- more rows -->

</nav>
```

| Part | Spec |
|---|---|
| Block | `left: 3.3cqw`, `top: 18cqw`, `width: 42cqw`, `gap: 1.05cqw` |
| Row | height `4.4cqw`, radius `--gc-radius-row`, bg `--gc-blue-tint-070` → `-090` on hover |
| Row padding | `0.55cqw` left, `1.4cqw` right — asymmetric, the tile provides the left inset |
| Label | `--gc-text-label`, weight 600, `--gc-blue-brand`, `margin-left: 1.2cqw` |
| Numeral | `--gc-text-label`, weight 700, `--gc-blue-numeral` |

**Rules**

- Five to seven rows. Past that it stops scanning as a menu and becomes a list.
- Numbers are zero-padded (`01`, not `1`) and muted. They are ordinals, not data — they must not
  compete with the label.
- The whole row is the hit target. Use a `<button>`, not a `<div>` with a click handler.
- Labels wrap to two lines on mobile. Keep them under about eight words.

---

## Card rail

```html
<div class="gc-rail gc-no-scrollbar">
  <div class="gc-rail-track">

    <article class="gc-card">
      <div class="gc-card-head">
        <span><b>fin</b><span>fact</span></span>
        <span class="gc-card-num">1</span>
      </div>
      <div class="gc-card-body">
        <p class="gc-card-title">Half of the institutions did not open the account in real time</p>
        <span class="gc-tag">#AI</span>
      </div>
    </article>

    <!-- Pulsing ring: this card opens a live, interactive demo -->
    <article class="gc-card gc-card--live"> … </article>

  </div>
</div>
```

| Part | Spec |
|---|---|
| Track | height `26cqw` / `86cqw`, `gap: 1.5cqw` / `4cqw` |
| Card | width `18cqw` / `60cqw`, radius `--gc-radius-card`, bg `--gc-blue-tint-080` |
| Header | padding `1cqw 1.3cqw`, bg `--gc-blue-header`, white text |
| Body | padding `1.3cqw` |
| Title | `--gc-text-body-lg`, weight 600, line-height `1.35`, `--gc-ink-600` |
| Tag | `--gc-text-caption`, weight 600, pill, bg `--gc-blue-header` |

**Behaviour**

- **Desktop** — `overflow: visible`, no scrollbar. Dragged by `gcDragRail()` in
  `js/cloud-style.js`, which translates the track. Trackpad and shift-wheel work too.
- **Mobile** — CSS switches to native `scroll-snap-type: x mandatory`; the JS stands down. The rail
  bleeds to the screen edges via negative margin so cards can sit flush.

**Rules**

- Every card is the same height. The tag is pushed to the bottom by `margin-top: auto`, so short
  and long titles still line up. Never hard-code a card height.
- The header repeats the wordmark in miniature. That is the device tying a detail card to the
  brand; keep the same bold/light split.
- Card titles: one sentence, no full stop, under ~12 words.
- `.gc-card--live` is a **promise**. The pulse means clicking opens something interactive. If it
  opens a static page, don't use it.

---

## Breadcrumb

```html
<div class="gc-detail" style="view-transition-name: gc-detail">
  <div class="gc-breadcrumb">
    <button class="gc-icon-btn" aria-label="Home">
      <svg><use href="#gc-icon-home"/></svg>
    </button>
    <button class="gc-icon-btn" aria-label="Back">
      <svg><use href="#gc-icon-back"/></svg>
    </button>
    <span class="gc-icon-tile gc-icon-tile--sm">
      <svg><use href="#gc-icon-identity"/></svg>
    </span>
    <h2 class="gc-breadcrumb-title">Onboarding, document upload and approval</h2>
    <span class="gc-breadcrumb-num">01</span>
  </div>
  <!-- rail or article goes here -->
</div>
```

`.gc-detail` anchors at `top: 13cqw`, `left: 3.3cqw`, `right: 1cqw` on every screen that uses it.
That shared position is what lets screens cross-fade in place.

**Rules**

- **Home is always leftmost**, then Back if present, then the category tile, then the title. Home
  never moves between screens 03 and 04 — a control that shifts position is a control users stop
  trusting.
- The card rail shows the ordinal (`01`); the article drops it and appends `| Finfact 1` to the
  title instead.
- One `<h2>` per screen.

---

## Article

```html
<p class="gc-article-title">Half of the institutions did not open the account in real time</p>
<p class="gc-article-lede">The point of digital is skipping the waiting room.</p>
<p class="gc-article-body">You open a bank account: photograph the document…</p>
```

| Level | Size | Weight | Line height | Colour |
|---|---|---|---|---|
| Title | `--gc-text-title` | 600 | 1.3 | `--gc-ink-600` |
| Lede | `--gc-text-body-lg` | 600 | 1.4 | `--gc-blue-brand` |
| Body | `--gc-text-body` | 400 | 1.7 | `--gc-ink-500` |

All three capped at `--gc-measure` (`50cqw`), leaving the right half of the stage for the device.

**Rules**

- Three levels, in this order, always: **what happened** (title), **why it matters in one line**
  (lede), **the evidence** (body).
- The lede is the only blue text in the column. It is the takeaway — the line a presenter says out
  loud. One sentence.
- Body under ~120 words. This is a slide behind a speaker, not an article.

---

## Device mock

```html
<div class="gc-device-slot">
  <div class="gc-phone">
    <div class="gc-phone-screen">
      <!-- iframe, web component, or screenshot -->
    </div>
  </div>
</div>
```

| Property | Value |
|---|---|
| Size | `22.5cqw × 47cqw` (aspect 22.5/47 on mobile) |
| Border | `0.4cqw solid --gc-blue-outline` |
| Radius | `--gc-radius-device` |
| Shadow | `--gc-shadow-device` |
| Position | `right: 6cqw`, vertically centred |
| Screen padding | `2.76cqw` (of the **phone's** width) |

**`.gc-phone` is its own container query container.** Inside it, `1cqw` = 1% of the *phone* width,
not the stage. So an embedded demo scales relative to the phone at any stage size:

```css
.gc-phone chat-messenger {
  --chat-messenger-internal-message-font-size: 4.3cqw;  /* 4.3% of phone width */
}
```

**Rules**

- Don't draw a notch, speaker, or home indicator. The frame is a hint, not a replica — detail here
  dates the design and distracts from the content.
- On mobile it becomes a full-width block below the prose.
- If you have no demo, leave it empty. An empty phone reads as "coming up"; a placeholder image
  reads as broken.

---

## Footer

```html
<div class="gc-footer">
  <div class="gc-footer-logo">
    <span>
      <span class="gc-g1">G</span><span class="gc-o1">o</span><span class="gc-o2">o</span><span class="gc-g2">g</span><span class="gc-l">l</span><span class="gc-e">e</span>
    </span>
    <span class="gc-cloud">Cloud</span>
  </div>
  <div class="gc-edition">Edition 2026</div>
</div>
```

`.gc-footer` is `display: contents` on desktop — it creates no box, so its two children position
themselves absolutely against the stage. On mobile it becomes a flex row pinned to the bottom of
the scroll with `margin-top: auto`.

**Rules**

- Per-letter spans with exact brand colours. See
  [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md#google-logotype). Do not tint, fade, or approximate them.
- "Cloud" is `--gc-ink-500`, weight 500, offset `0.7cqw`.
- The footer appears on every screen and never moves.

---

## Icons

Injected by `js/gc-icons.js` as a hidden sprite, then referenced:

```html
<svg><use href="#gc-icon-home"/></svg>
```

| Id | Meaning |
|---|---|
| `gc-icon-identity` | Onboarding, KYC, identity |
| `gc-icon-catalog` | Products, catalogue, listings |
| `gc-icon-support` | Service channels, accessibility |
| `gc-icon-mobile-check` | App, mobile security |
| `gc-icon-open` | Open ecosystems, APIs |
| `gc-icon-home` | Home navigation |
| `gc-icon-back` | Back navigation |
| `gc-icon-cloud` | Google Cloud mark |

**Adding one**

Append a `<symbol>` to the sprite in `js/gc-icons.js`:

```html
<symbol id="gc-icon-yourname" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round">
  <!-- paths -->
</symbol>
```

**Rules**

- 24×24 viewBox, always.
- Stroked in `currentColor`, `fill="none"`, `stroke-width` 1.7 (2.0–2.3 for nav glyphs), round caps
  and joins. This is what makes them look like one set.
- No fills except `gc-icon-cloud`, which is a logo rather than a UI glyph.
- Size the `<svg>` from the parent (`.gc-icon-tile svg { width: 1.8cqw }`), never on the symbol.

> **Why a JS sprite?** `<use href="icons.svg#id">` requires an HTTP origin and fails silently on
> `file://`. Injecting the sprite from JS means the templates work either way.
