# Neutral Google Cloud app template design

## Status

Approved in conversation on 2026-08-15. This specification supersedes the
multi-solution catalog and demo-pack product direction.

## Purpose

Cloud Style is a reusable foundation that helps a developer agent make a new
or existing application feel native to Google Cloud. The repository includes
one neutral sample application as executable design evidence. The sample is
not a catalog of products, workflows, demos, or suggested use cases.

## Product definition

The repository provides:

1. A neutral Google Cloud sample application.
2. Reusable visual tokens, shell patterns, and application components.
3. Antigravity instructions for creating a new application from the template.
4. Antigravity instructions for applying the visual system to an existing
   application without changing its framework or behavior.
5. Automated visual, interaction, responsive, and accessibility verification.

The sample application proves the system. It is not the product offered by the
template and must be easy to replace.

## Naming and language

The default product name is **Google Cloud App**. It must be configurable from
one application configuration module.

Default content uses neutral application terms:

- Overview
- Resources
- Activity
- Settings
- Environments
- Operations
- Status

The visible application must not use these terms:

- Cloud Workspace
- Catalog or Catálogo
- Demo or Demos
- Summit
- Session or track
- Image Studio, Video Studio, or other suggested product categories

Documentation may use “sample application” and “demonstrate” when explaining
the repository. The restriction applies to product UI and default content.

## Information architecture

The sample application has four primary destinations.

### Overview

Shows application status, environment summary, recent operations, and one
clear primary action. It demonstrates hierarchy and responsive composition
without becoming a marketing landing page or dashboard of invented metrics.

### Resources

Shows a filterable resource list. Selecting a resource opens its detail view.
The detail view uses tabs for Summary, Configuration, and Activity. It includes
status, metadata, actions, and a clear path back to the list.

### Activity

Shows a quiet chronological record of operations, actors, times, and outcomes.
It demonstrates loading, empty, success, warning, and error presentation.

### Settings

Shows a representative edit form with labels, help text, validation, save, and
cancel behavior. Changes remain local and clearly identify the sample state.

## Application shell

The desktop shell contains:

- A thin Google multicolor signature at the top.
- A compact application header with configurable product name.
- Project or environment context.
- Persistent left navigation.
- A primary content region that uses normal application flow.

The mobile shell replaces the persistent sidebar with compact navigation and
stacks content in document flow.

The shell must not contain a slide footer, event edition line, poster-scale
wordmark, fixed 16:9 presentation framing, phone mockup, or presentation rail.
The Super Cloud artwork may appear as restrained background identity on the
Overview screen. It must not compete with working content.

## Visual system

- Use Google Sans for product names, headings, navigation, controls, and
  emphasized values.
- Use Google Sans Text for descriptions, forms, tables, and sustained reading.
- Use official Google colors for the multicolor signature and Super Cloud
  artwork.
- Reserve Google blue for the current selection, links, focus, and one primary
  action in a view.
- Use white and pale neutral surfaces, quiet dividers, restrained elevation,
  and Console-like density.
- Use tokens rather than hard-coded component colors and dimensions.
- Preserve visible keyboard focus and reduced-motion behavior.

## Reusable component set

The first release contains only components needed by the sample application:

- Application header
- Desktop and mobile navigation
- Breadcrumbs
- Page header
- Status indicator
- Primary, secondary, and text actions
- Resource list and row
- Tabs
- Detail sections
- Activity list
- Form fields, help text, and validation
- Empty, loading, success, warning, and error states
- Confirmation dialog

The repository is not a general-purpose component library. New components are
added only when a supported application pattern requires them.

## Configuration and data boundaries

Application identity, navigation labels, sample resources, activity, and form
defaults live outside shell and component internals. The sample uses local,
deterministic data and does not imply a live Google Cloud connection.

The shell consumes a small configuration object. Screens consume sample data
through focused modules. A developer agent must be able to replace content and
data without editing CSS or shell markup.

## Agent workflows

### Create a new application

Antigravity starts from the sample shell, collects only missing product
decisions, replaces neutral sample data, adds required routes and components,
and verifies the result. It must not preserve sample screens that the new
application does not need.

### Adopt an existing application

Antigravity inventories the existing framework, routes, state, components, and
tests. It proposes an adoption map, introduces tokens and shell integration,
converts one representative screen, verifies it, and continues incrementally.
It must preserve application behavior and public interfaces unless the user
separately approves an architectural change.

## Removed scope

Remove these concepts from the implementation and future plans:

- Solution catalog and suggested solution choices
- Demo-pack registry and five-pack roadmap
- Image, video, analytics, database, and business-flow sample products
- Event and Summit content
- Fact cards and article screens
- Horizontal presentation rails
- Phone and device mockups
- Showcase, Console, and Hybrid presentation presets
- A fixed slide-stage mental model

Existing assets or history may remain in Git history, but the active sample,
documentation, screenshots, tests, and Antigravity guidance must not route
developers toward these removed concepts.

## Verification

Verification must cover:

- Every primary destination and resource-detail route
- Desktop at 1280x720 and 3840x2160
- Mobile at 390x844
- Keyboard navigation and activation
- Visible focus
- Form validation
- Loading, empty, success, warning, and error states
- Reduced motion
- Horizontal overflow and content clipping
- Browser console and page errors
- Absence of removed slide and catalog primitives
- Canonical screen and component screenshots

The verifier must fail if the application restores a fixed presentation stage,
slide footer, phone mockup, numbered card rail, suggested-solution catalog, or
event-specific content.

## Success criteria

The work is complete when:

1. A developer recognizes the sample as a neutral Google Cloud application.
2. No visible screen reads as a slide, event deck, product catalog, or showcase.
3. An agent can identify which files define identity, shell, components, data,
   screens, and verification.
4. New-app and existing-app Antigravity workflows both use the same visual
   contract.
5. All required automated checks and screenshots pass.
