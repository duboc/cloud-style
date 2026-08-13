# Layout: the container-query stage

This is the load-bearing idea in the whole system. Understand this page and the rest is detail.

---

## The problem it solves

A demo deck gets shown on a laptop, a 4K conference display, a projector at an odd resolution, and
someone's phone. The usual responsive approach — breakpoints that reflow content — is wrong here,
because a slide is a *composition*. Move the CTA to a new line and you have broken the design, not
adapted it.

What you actually want is for the slide to behave like a slide: fixed proportions, scaled to fit.

---

## The mechanism

### 1. A stage locked to 16:9

```css
.gc-stage {
  width: min(100vw, 177.78vh);
  aspect-ratio: 16 / 9;
}
```

`177.78vh` is `16/9 × 100`. So the stage is *the wider of* "full viewport width" or "as wide as a
16:9 box of full viewport height can be" — whichever is smaller wins, which means the stage always
fits inside the viewport and always touches two of its edges. Letterboxing appears on the other
two axes, filled with white.

### 2. That stage becomes the unit of measurement

```css
.gc-stage { container-type: inline-size; }
```

This one line makes the stage a *container query container*, which unlocks `cqw`:

```
1cqw = 1% of the stage's width
```

Every size in the design is written in `cqw`. The wordmark is `10cqw`. The card is `18cqw` wide.
The gutter is `3.3cqw`. Nothing is in `px`.

### 3. Therefore the design scales as one object

| Viewport | Stage width | `1cqw` | Wordmark (`10cqw`) | Card (`18cqw`) |
|---|---|---|---|---|
| 1280 × 720 | 1280px | 12.8px | 128px | 230px |
| 1600 × 900 | 1600px | 16.0px | 160px | 288px |
| 3840 × 2160 | 3840px | 38.4px | 384px | 691px |
| 1440 × 900 (4:3-ish) | 1600px → clamped to 1440px | 14.4px | 144px | 259px |

Identical layout, three sizes. No breakpoints involved.

**This is why you must never introduce a `px` value inside the stage.** One `px` font size and that
element stops scaling with everything around it — it will look correct on your monitor and wrong on
the projector. There are four narrow exceptions, listed in
[AGENTS.md](../AGENTS.md#1-no-px-inside-gc-stage); the main one is `--gc-shadow-action`, a small
physical shadow on a button that reads as mud when scaled up.

---

## The three geometry variables

The background ripple needs to be positioned against the *stage*, but it lives outside the stage so
it can bleed past the letterbox edges. `.gc-cover` publishes the stage's geometry for it:

```css
.gc-cover {
  --s:   min(100vw, 177.78vh);        /* stage width                       */
  --h:   calc(var(--s) * 9 / 16);     /* stage height                      */
  --top: calc((100vh - var(--h)) / 2);/* viewport-top → stage-top distance  */
}
```

The ripple circles then anchor to a point defined in stage terms:

```css
.gc-ripple > i {
  right: calc(var(--s) * 0.18);            /* 18% of stage width from the right */
  top:   calc(var(--top) + var(--h) * 0.71);/* 71% of the way down the stage     */
  transform: translate(50%, -50%);          /* make that point the true centre   */
}
```

Sizes are fractions of `--s`: `0.78`, `0.64`, `0.50`, `0.37`, `0.25`, `0.125`. Each ring is roughly
`0.78×` the previous one, which is what makes the spacing read as even rather than mechanical.

```
   ┌──────────────── viewport ────────────────┐
   │            (white letterbox)             │
   │  ┌────────── .gc-stage 16:9 ──────────┐  │
   │  │                                    │  │   ●  ← ripple centre
   │  │  finfacts                     ╭────┼──┼──╮   x: 18% of --s from right
   │  │                              ╭┼────┼──┼─╮│   y: 71% down the stage
   │  │  Discoveries                 ││ ●  │  │ ││
   │  │  and opportunities           ╰┼────┼──┼─╯│   rings bleed past the
   │  │  [ CTA ]                      ╰────┼──┼──╯   stage on purpose
   │  │  Google Cloud   Edition 2026       │  │
   │  └────────────────────────────────────┘  │
   └──────────────────────────────────────────┘
```

---

## The mobile trick

Below 768px:

```css
.gc-stage {
  container-type: normal;   /* ← the whole trick */
  aspect-ratio: auto;
  display: flex;
  flex-direction: column;
}
```

Setting `container-type: normal` removes the stage from container-query mode. There is now no
container ancestor, so **`cqw` falls back to resolving against the small viewport: `1cqw` becomes
`1vw`.**

That single change re-scales every size in the system at once. All that remains is:

1. **Re-scale the tokens** (`css/tokens.css`, mobile block). `10cqw` of a wide stage is a big
   wordmark; `10vw` of a phone is a small one. So the mobile values are roughly 3× the desktop
   ones — `--gc-text-wordmark` goes `10cqw → 13cqw`, body copy `1.05cqw → 3.7cqw`.

2. **Unwind the absolute positioning** so elements stack in document order:

   ```css
   .gc-wordmark, .gc-lede, .gc-btn--cover, .gc-menu,
   .gc-detail, .gc-device-slot, .gc-footer-logo, .gc-edition {
     position: static;
     inset: auto;
     transform: none;
   }
   ```

3. **Pull the ripple up** with `--top: -18vw`, so it sits behind the header rather than the middle
   of a long scroll.

No component rule is duplicated. The same `.gc-card` declaration serves both layouts.

---

## Nested containers

`.gc-phone` is *also* `container-type: inline-size`. Inside it, `cqw` means "% of the phone's
width", not the stage's.

This matters when you embed a demo: a chat widget inside the phone can size its own type in `cqw`
and stay proportional to the phone regardless of how big the stage is. That is exactly what the
original deck does with the Conversational Agents chat SDK, feeding it `cqw` font sizes:

```css
.gc-phone chat-messenger {
  --chat-messenger-internal-message-font-size: 4.3cqw;   /* 4.3% of phone width */
}
```

---

## Stacking order

| Layer | `z-index` | What |
|---|---|---|
| `.gc-ripple` | 0 | Background circles, `pointer-events: none` |
| `.gc-veil` | 5 | `rgba(255,255,255,0.7)` — calms the ripple on dense screens |
| `.gc-stage` | 10 | All content |

Use the veil on the card rail and article screens. Leave it off the cover and the menu, where the
ripple is the only thing making the composition feel intentional.

---

## Rules

1. **No `px` inside the stage.** Sizes are `cqw`, or a token that resolves to `cqw`. Four
   exceptions are documented in [AGENTS.md](../AGENTS.md#1-no-px-inside-gc-stage).
2. **The stage is the only container** — except `.gc-phone`. Adding `container-type` anywhere else
   silently changes what `cqw` means for everything beneath it, which is very hard to debug.
3. **Position against the stage, not the viewport.** `left: 3.3cqw`, not `left: 60px`.
4. **The wordmark, ripple, and footer never move between screens.** That fixed frame is what makes
   the view transitions feel like one continuous surface instead of separate pages.
