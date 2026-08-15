# Application layout

Cloud Style uses normal application flow. The shell remains stable while route content scrolls, reflows, and grows according to the product's information.

## Desktop shell

The desktop shell has four layers:

1. A four-color signature at the top edge.
2. A compact sticky header with product and project context.
3. A persistent left navigation.
4. A flexible main region with a centered maximum content width.

```html
<div class="gc-app">
  <div class="gc-google-signature" aria-hidden="true">…</div>
  <header class="gc-app-header">…</header>
  <div class="gc-app-body">
    <aside class="gc-sidebar">…</aside>
    <main class="gc-main" id="main-content">…</main>
  </div>
</div>
```

`js/app.js` owns this markup. Screen renderers return only the page inside `gc-main`.

## Content flow

`.gc-main` can grow taller than the viewport. `.gc-page` limits line length and panel width without constraining height. Screens use grid and flex layouts where those relationships are meaningful; they do not position working content against the viewport.

The Super Cloud artwork appears only in the Overview identity panel. It is decorative, clipped by its panel, and removed from the content hierarchy with an empty alternative description.

## Mobile shell

Below 768 CSS pixels:

- The sidebar is removed from layout.
- A compact horizontal navigation appears below the header.
- Page headers, panels, forms, and summary regions stack.
- The resource table becomes readable resource blocks.
- The document scrolls normally.
- Controls remain at least 40 CSS pixels tall, with primary mobile actions filling the available width.

There is no separate tablet product state. Intermediate widths use the same application flow until the mobile breakpoint.

## Wide screens

At 3840x2160 the shell remains application-sized. The content maximum widens modestly, but text and controls do not scale into poster sizes. This is an intentional difference from presentation surfaces.

## Layout checks

- No fixed presentation aspect ratio.
- No viewport letterboxing.
- No horizontal overflow at 390x844, 1280x720, or 3840x2160.
- Long content remains in document flow.
- The header and navigation retain stable positions between routes.
- Focused content is not hidden by sticky chrome.
