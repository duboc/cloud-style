# Application components

Cloud Style supports the components required by the neutral sample. Canonical visual states are rendered in `components.html` and captured in `docs/screenshots/components-app-surfaces.png`.

## Page header

```html
<header class="gc-page-header">
  <div>
    <p class="gc-eyebrow">Inventory</p>
    <h1>Resources</h1>
    <p class="gc-page-description">View status and configuration.</p>
  </div>
  <button class="gc-button gc-button--primary">Create resource</button>
</header>
```

Use one `h1`. The eyebrow provides context, not another title. Keep one visible filled action.

## Panel and section heading

```html
<section class="gc-panel" aria-labelledby="summary-heading">
  <div class="gc-section-heading">
    <div><p class="gc-eyebrow">Environment</p><h2 id="summary-heading">Production summary</h2></div>
    <a class="gc-text-link" href="#/resources">View resources</a>
  </div>
</section>
```

Panels group one working relationship. Do not wrap every value in its own card.

## Status

```html
<span class="gc-status gc-status--success">Healthy</span>
<span class="gc-status gc-status--warning">Attention</span>
<span class="gc-status gc-status--error">Error</span>
```

Always include visible text. Color and the dot are supplementary.

## Resource list

Use a semantic table on desktop. Each name is a deep link, and the whole row also supports pointer and keyboard activation. On mobile, CSS presents each row as a stacked resource block without changing the HTML.

Filtering sets the native `hidden` attribute on nonmatching rows and updates the visible count. Match against name, type, region, and status.

## Tabs

```html
<div class="gc-tabs" role="tablist" aria-label="Resource details">
  <button role="tab" aria-selected="true" aria-controls="panel-summary">Summary</button>
</div>
<section id="panel-summary" role="tabpanel">…</section>
```

Only the selected tab has `tabindex="0"`. Left and Right arrows move focus and activate the adjacent tab. Hidden panels use the native `hidden` attribute.

## Fields and validation

```html
<label class="gc-field">
  <span>Display name</span>
  <input name="displayName" aria-describedby="display-name-help">
  <small id="display-name-help">Shown in the application header.</small>
  <small class="gc-field-error" id="display-name-error" hidden>Enter a display name.</small>
</label>
```

On invalid submission, set `aria-invalid`, add the error ID to `aria-describedby`, reveal the error, and move focus to the field. Successful changes are announced through a `role="status"` region.

## Application states

Loading, empty, success, warning, and error use the same content region. Each state contains a short heading, one explanation, and an action only when the user can make progress. Loading uses `role="status"`; reduced motion collapses its spinner.

## Confirmation dialog

Use native `<dialog>` with a labeled heading. The dialog contains one outlined cancel action and one filled confirmation action. Closing the dialog returns the user to the unchanged route and announces the result in the page status region.
