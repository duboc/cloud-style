# Antigravity Cloud Style kit design

## Status

Approved for specification on 2026-08-15. This document defines the design. It does not authorize implementation.

## Purpose

Turn `cloud-style` into an agent-ready starter for Google Antigravity. A developer must be able to use Antigravity to:

1. Create a new demo application with the Cloud Style visual language.
2. Apply Cloud Style to an existing application without replacing its framework, routes, data flow, or behavior.

The result must combine the operational clarity of Google Cloud Console with the stronger identity and storytelling of Google Cloud marketing. Antigravity is the only supported developer-agent integration. The project must not add Claude Code or Codex instruction packages.

## Product principles

- **Application before decoration.** The result must behave like a credible product demonstration, not a slide deck with decorative controls.
- **Console structure, marketing identity.** Console patterns provide hierarchy, status, navigation, and working surfaces. Marketing patterns provide the wordmark, graphic moment, narrative, and event or product identity.
- **A portable contract.** Design knowledge must not depend on one framework or on copying the current `index.html` implementation.
- **Two supported entry points.** Cloning this repository and installing the kit into an existing repository are equally valid workflows.
- **Evidence before completion.** Antigravity must verify desktop, mobile, accessibility, interaction, and browser-console behavior before it reports success.
- **Preserve existing applications.** Adoption must not rewrite application architecture merely to simplify styling.
- **Always recognizable as Google Cloud.** Every supported preset and demo pack must use the approved Google Cloud visual language. A result that reads as a generic blue SaaS dashboard fails the design contract.

## Scope

### In scope

- Native Antigravity workspace rules under `.agents/rules/`.
- A reusable Antigravity skill under `.agents/skills/cloud-style/`.
- Antigravity workflows for creation, adoption, and verification under `.agents/workflows/`.
- A stable separation between the presentation shell, theme, content, and interactive demos.
- Framework-neutral guidance with concrete adapters for plain HTML and common component frameworks.
- Reference screenshots and explicit visual acceptance criteria.
- A complete screenshot catalog for screens, components, demo packs, responsive layouts, and important interaction states.
- Automated validation that can be invoked by Antigravity and by a developer.
- Documentation for clone and portable-install paths.

### Out of scope

- Claude Code, Codex, Cursor, or other agent-specific packages.
- A hosted design editor or visual page builder.
- A general-purpose component library.
- Automatic deployment to Google Cloud.
- An npm installer in the first release. A documented file-copy installation is sufficient.
- Replacing the application's business logic, framework, router, state management, or back end during adoption.
- A neutral or non-Google brand mode. Cloud Style is intentionally specific to Google Cloud experiences.

## Supported workflows

### Create a new demo application

The developer clones `cloud-style`, opens it as an Antigravity workspace, and invokes `/create-cloud-demo` with a short product brief.

Antigravity must:

1. Inspect the repository rules and skill.
2. Ask only for missing decisions that materially affect the result: audience, story, framework, identity, required screens, and interactive demonstrations.
3. Write or update a concise product, UI, and engineering brief before implementation.
4. Select one presentation preset: Showcase, Console, or Hybrid.
5. Build from the stable shell and tokens rather than recreating the visual language from memory.
6. Keep product content and demo configuration outside shell internals.
7. Run the verification workflow.
8. Produce screenshots and a short walkthrough that states what was tested.

The default preset is Hybrid because it best expresses the repository's intended identity: a marketing-grade entry that leads into credible Console-like interaction.

### Adopt Cloud Style in an existing application

The developer copies the portable `.agents` package, Cloud Style assets, and verification tooling into an existing repository, then invokes `/adopt-cloud-style`.

Antigravity must:

1. Inventory the framework, routes, data flow, component boundaries, existing design system, tests, and accessibility behavior.
2. Identify which existing screens correspond to shell, navigation, content, data, and demo roles.
3. Present an adoption map and migration sequence before editing code.
4. Introduce tokens and the minimum shell integration first.
5. Convert one representative screen and verify it as the approved reference.
6. Continue screen by screen only after the reference establishes the correct direction.
7. Preserve behavior and public interfaces unless the developer separately approves an architectural change.
8. Run existing tests plus Cloud Style verification.

The workflow must stop and explain the conflict when an existing design-system rule cannot coexist with Cloud Style. It must not silently discard either system.

### Verify a Cloud Style application

The `/verify-cloud-style` workflow must run independently of creation or adoption. It must check:

- Browser console errors.
- Desktop compositions at 1280×720 and 3840×2160.
- Mobile layout at 390×844.
- Keyboard reachability and activation of every interactive element.
- Visible focus states.
- Reduced-motion behavior.
- Content overflow and clipping.
- Required accessible names.
- Token and container-query constraints.
- Meaningful interaction for every surface marked as live.

The workflow must save screenshots and report failures with the affected screen and requirement. It must never report completion when a required check could not run; it must report the missing dependency or environment constraint instead.

## Repository architecture

```text
cloud-style/
├── .agents/
│   ├── rules/
│   │   ├── cloud-style-foundations.md
│   │   ├── responsive-layout.md
│   │   └── visual-verification.md
│   ├── skills/
│   │   └── cloud-style/
│   │       ├── SKILL.md
│   │       ├── references/
│   │       │   ├── visual-language.md
│   │       │   ├── component-contracts.md
│   │       │   ├── adoption-guide.md
│   │       │   └── failure-examples.md
│   │       └── assets/
│   │           └── approved reference screenshots
│   └── workflows/
│       ├── create-cloud-demo.md
│       ├── adopt-cloud-style.md
│       └── verify-cloud-style.md
├── starter/
│   ├── shell/
│   ├── demo-packs/
│   │   ├── image-studio/
│   │   ├── video-studio/
│   │   ├── analytics/
│   │   ├── databases/
│   │   └── business-flows/
│   └── presets/
├── css/
├── js/
├── docs/
└── tools/
```

### Rules

Rules are short, always-active constraints. They define non-negotiable behavior such as preserving an existing application's architecture, using tokens, maintaining the stage container, supporting mobile, and verifying before completion. They must link to the skill for detailed guidance instead of duplicating it.

### Skill

The `cloud-style` skill contains the reusable design knowledge Antigravity needs when creating or restyling an application. Its description must cause it to load for Cloud Style creation, adoption, component, layout, and visual-review tasks.

The skill must explain intent as well as implementation constraints. It must teach why a pattern exists, when to use it, and how to recognize failure. Reference material must remain modular so Antigravity loads only the relevant detail.

### Workflows

Workflows are user-invoked, repeatable procedures. They orchestrate discovery, planning, implementation, and verification but do not duplicate design rules. Each workflow must define its inputs, checkpoints, allowed mutations, and completion evidence.

### Starter source

The starter source is the canonical working implementation. It must separate:

- **Shell:** stage, global navigation, background identity, footer, routing hooks, and screen slots.
- **Theme:** color, typography, spacing, elevation, motion, and identity assets.
- **Content:** product copy, tracks, cards, metrics, labels, and demo selection.
- **Demos:** isolated interactive modules with explicit mounting and cleanup boundaries.
- **Presets:** Showcase, Console, and Hybrid composition choices.

No Summit-specific label, metric, hashtag, or demo script may be required by the shell.

## Visual language contract

### Google Cloud identity invariants

Cloud Style must always look like a Google Cloud experience. Antigravity must preserve the following identity signals in both creation and adoption workflows:

- Google Sans for wordmarks, headings, navigation, controls, numeric emphasis, and application chrome.
- Google Sans Text for paragraphs, descriptions, dense labels, tables, and other sustained reading.
- The existing Google Cloud Super Cloud artwork as the canonical large identity asset.
- The official Google blue, red, yellow, and green values when the multicolor Google identity is used.
- Google Cloud blue roles for primary action, current selection, links, and informational emphasis.
- White and pale neutral working surfaces, restrained elevation, clear borders, and Console-like information hierarchy.
- A thin Google color strip or equivalent approved multicolor signature where it strengthens product identity without competing with content.
- The exact Google Cloud footer logotype treatment defined by the design system.

The Super Cloud artwork may dominate the marketing entrance. On working screens it must become a restrained crop, watermark, or background accent so operational content remains primary. Antigravity must not redraw, recolor, distort, or replace the approved asset with a generic gradient blob.

Google Sans is mandatory for Cloud Style output. Installation and usage documentation must state that Cloud Style is intended for authorized Google Cloud demos, internal material, partner experiences, and other contexts where use of Google brand assets and fonts is permitted.

### Console qualities

- Clear information hierarchy and predictable navigation.
- Credible status, metrics, controls, and working surfaces.
- Restrained density and purposeful color roles.
- Familiar application behavior, including keyboard and focus support.

### Marketing qualities

- One recognizable identity moment per experience.
- A concise story with a strong entry screen.
- Deliberate typography and graphic composition.
- Presenter-friendly pacing and transitions.

### Color roles

The implementation must distinguish brand, primary action, selected navigation, information, live status, warning, error, and demo-visualization colors. It must not use a single saturated blue indiscriminately for every interactive or branded element.

### Responsive behavior

Desktop remains a composed 16:9 presentation surface. Mobile is a separately designed application flow that stacks and scrolls. Mobile must not be treated as the desktop composition scaled down or merely have absolute positioning removed.

### Interactive promise

Any card, badge, pulse, status, or device that appears interactive must respond meaningfully. Static placeholders must not use live indicators.

## Demo packs

Demo packs are reusable, working capability modules. Antigravity may compose multiple packs into one end-to-end story. Each pack must include a catalog entry, component contract, realistic sample data, meaningful interaction, content schema, responsive behavior, accessible states, verification scenario, and reference screenshots.

### Image Studio

Supports image generation or import, crop, retouch, comparison, prompt or edit history, review, and approval. It must show a real before-and-after or edit-state change rather than a static gallery.

### Video Studio

Supports media import, playback, trim selection, captions, chapters, review comments, and export status. The reference demo may simulate processing, but timeline controls and review states must work.

### Data Analytics

Supports a query or exploration input, filters, charts, supporting evidence, and an explanation of an operational decision. Charts must use labeled quantities and units and must not exist only as decorative dashboard filler.

### Databases

Supports schema or collection inspection, safe query execution, database health, replication or topology, and explainable operational status. Demonstrations must clearly distinguish simulated sample data from a live database connection.

### Business Flows

Supports requests, agent or automation steps, human approvals, handoffs, exceptions, audit history, and completion states. A flow must show state transitions and accountability, not only a static node diagram.

## Screenshot catalog

Screenshots are product artifacts and verification evidence. The repository must generate and maintain them rather than relying on manually selected marketing captures.

### Required screen captures

- Marketing entrance for Showcase and Hybrid presets.
- Console workspace for Console and Hybrid presets.
- Demo catalog with all five demo packs.
- Category or track detail.
- Individual demo detail for Image Studio, Video Studio, Data Analytics, Databases, and Business Flows.
- Architecture or evidence view when included by the preset.
- Empty, loading, success, warning, and error states used by the reference application.

### Required component captures

- Application bar and navigation.
- Wordmark and Google Cloud identity treatments.
- Buttons, icon buttons, tabs, chips, and status indicators.
- Menu rows, catalog tiles, cards, breadcrumbs, and metrics.
- Forms, inputs, filters, selectors, and dialogs.
- Charts, data surfaces, database topology, flow nodes, and audit events.
- Device or embedded-demo frame when the preset uses one.
- Each demo pack's principal interactive component and important states.

### Viewports and states

Every required screen must have a desktop capture at 1280×720 and a mobile capture at 390×844. The canonical overview and working screen must also have a 3840×2160 scale capture. Component captures may use a dedicated component showcase viewport, but the capture must include the complete component without clipping.

Interactive components must capture rest, focus, active or selected, success, and error states when those states exist. Reduced-motion verification does not require duplicate screenshots unless motion changes the final layout.

### Storage and naming

Generated captures belong under `docs/screenshots/` with stable, descriptive names:

```text
<preset>-<screen>-<viewport>.png
component-<name>-<state>.png
demo-<pack>-<screen>-<viewport>.png
```

The verification report must identify the source route or state for each capture. Reference screenshots used by the Antigravity skill must be copied from this verified catalog so the agent and repository documentation use the same visual truth.

## Presets

### Hybrid

Default. Uses a strong identity-led overview, then transitions into Console-like navigation, catalog, detail, and live demo surfaces.

### Showcase

Prioritizes presenter pacing, large identity, fewer controls, and guided navigation. It still requires meaningful interaction where live signals appear.

### Console

Prioritizes application navigation, operational information, and task completion. Marketing identity remains present but does not dominate working screens.

Presets change composition and emphasis. They must not fork the core components or accessibility behavior.

## Portable installation

The first release uses a documented copy-based installation. The portable package includes:

- `.agents/rules/`
- `.agents/skills/cloud-style/`
- `.agents/workflows/`
- The required theme, assets, and verification tooling

The installation guide must identify destination paths, conflicts, and files that adopters are expected to customize. It must not overwrite an existing `.agents` directory wholesale. The developer merges the Cloud Style entries into it.

An `npx install-cloud-style --antigravity` command can be considered later if repeated manual installation proves error-prone. It is not required for the initial architecture.

## Failure handling

- If Antigravity cannot determine whether the task is creation or adoption, it must ask before modifying files.
- If required browser tooling is unavailable, verification fails with an actionable dependency message.
- If an adoption would require changing public behavior or architecture, the workflow pauses for approval.
- If visual checks reveal clipping, overlap, unreadable contrast, or false live signals, the workflow returns to implementation and repeats verification.
- If reference screenshots and written rules conflict, the written rules are authoritative and the conflict must be reported.

## Acceptance criteria

The design is successfully implemented when all of the following are true:

1. Antigravity recognizes the workspace rules, skill, and three workflows from their native `.agents` paths.
2. A developer can clone this repository and create a new Hybrid demo without editing shell internals.
3. A developer can copy the portable kit into an existing application and receive an adoption plan before code changes.
4. Adoption preserves the existing framework, routes, data flow, behavior, and tests unless separately approved.
5. Product identity, content, and demo assignment are configurable outside the shell.
6. At least one meaningful interactive demo is available in the reference starter.
7. All five required demo packs are available with meaningful interactions and isolated contracts.
8. Every preset and demo pack is recognizably Google Cloud and uses Google Sans and Google Sans Text for their defined roles.
9. The verified screenshot catalog contains all required screen, component, viewport, and state captures.
10. The reference implementation passes desktop and mobile visual checks, keyboard checks, reduced-motion checks, and console-error checks.
11. Antigravity produces screenshots and a verification walkthrough before claiming completion.
12. Documentation explains both entry paths with copyable commands and example prompts.
13. No Claude Code or Codex integration files are added as part of this feature.

## Documentation deliverables

- A README entry that explains create and adopt paths.
- An Antigravity quickstart with example `/create-cloud-demo`, `/adopt-cloud-style`, and `/verify-cloud-style` prompts.
- A portable installation guide.
- Updated design-system documentation that reflects the current Console and marketing hybrid.
- Generated screen and component screenshot catalog as specified above.
- Approved Google Cloud identity asset and typography usage guidance for Antigravity.

## Implementation sequencing constraints

The implementation plan must address current template blockers before treating the Antigravity kit as production-ready: browser-console errors, broken mobile composition, desktop detail collisions, and non-keyboard-operable cards. The agent package must describe a stable system, not institutionalize current defects.

The implementation plan should then proceed in this order:

1. Stabilize and verify the reference application.
2. Separate shell, theme, content, demo packs, and presets.
3. Write Antigravity rules and the Cloud Style skill.
4. Write create, adopt, and verify workflows.
5. Validate both entry paths in clean test workspaces.
6. Update documentation and reference screenshots.
