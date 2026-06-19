---
name: Institutional Incident Management
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444653'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#611e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#872d00'
  on-tertiary-container: '#ffa583'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is anchored in the principles of **Corporate Modernism**, prioritizing clarity, hierarchy, and a sense of institutional stability. Designed for school administrators and safety officers, the UI evokes a feeling of calm control during high-pressure situations.

The aesthetic utilizes a structured "Admin Dashboard" approach: heavy on functional whitespace, precise alignment, and a utilitarian layout that reduces cognitive load. It balances the authoritative nature of educational governance with the modern efficiency of a SaaS platform. The primary goal is to provide a trustworthy environment where data is easily scannable and actions are unambiguous.

## Colors

The palette is led by **Educational Blue**, a deep, saturated navy that communicates intelligence and reliability. This is complemented by **Alert Orange**, reserved strictly for pending items, warnings, and elements requiring immediate attention.

Neutral tones are pulled from a "Cool Gray" spectrum to maintain a crisp, professional atmosphere without feeling sterile. 
- **Primary:** Used for main actions, navigation headers, and active states.
- **Secondary:** Used for "Pending" status badges and high-priority triage alerts.
- **Surface & Background:** A subtle distinction between `#f8fafc` (page background) and white (card surfaces) creates a clear visual hierarchy of information containers.

## Typography

The design system exclusively utilizes **Inter** for its exceptional legibility and neutral, systematic character. The typographic scale is optimized for data-dense environments.

- **Headlines:** Use semi-bold weights with slight negative letter-spacing to create a "tight" professional feel.
- **Body Text:** Standardized at 16px for comfort, with a 14px variant for secondary details in tables and lists.
- **Labels:** Uppercase labels are used sparingly for section headers and table column titles to provide clear structural markers.
- **Numerical Data:** Given the system's nature, tabular lining figures should be used in tables to ensure numbers align vertically for easy comparison.

## Layout & Spacing

This design system follows a **Fixed-Fluid Hybrid Grid**. On desktop, the sidebar navigation is fixed at 280px, while the main content area utilizes a 12-column fluid grid.

- **Rhythm:** A strict 8px spacing system ensures consistent alignment.
- **Gaps:** Gutters are set to 24px to ensure distinct separation between data cards.
- **Responsive Behavior:** On tablet, the sidebar collapses into an icon-only rail or a hamburger menu. On mobile, the 12-column grid reflows into a single column with 16px horizontal margins.
- **Safe Areas:** Content is always contained within cards to prevent visual "bleeding" on large displays.

## Elevation & Depth

Visual hierarchy is established through a combination of **Tonal Layering** and **Ambient Shadows**.

1.  **Level 0 (Background):** The canvas color (`#f8fafc`) sits at the lowest level.
2.  **Level 1 (Cards/Sidebar):** Primary containers use a white background with a 1px solid border (`#e2e8f0`) and a subtle 4px blur shadow with 2% opacity.
3.  **Level 2 (Modals/Dropdowns):** Interactive overlays use a more pronounced 12px blur shadow with 8% opacity to pull them forward from the UI.

Depth is used functionally: anything the user can interact with or read (like a report card) is elevated; structural backgrounds remain flat.

## Shapes

The design system uses a **Rounded** (Level 2) shape language. 
- **Standard UI Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius. 
- **Large Containers:** Dashboard widgets and main content areas use a 1rem (16px) radius to soften the high-density data layout.
- **Interactive States:** Focus states should mirror the container's corner radius exactly, with a 2px offset ring in the primary color.

## Components

### Buttons
- **Primary:** Solid `#1e40af` with white text. High emphasis for "Submit Report" or "Save Changes."
- **Secondary:** Outlined with a 1px border of `#cbd5e1`. Used for "Cancel" or secondary navigation.
- **Ghost:** No border or background. Used for low-priority actions in tables.

### Tables
Professional, high-density tables are the core of the system.
- **Header:** Light gray background (`#f1f5f9`) with uppercase labels.
- **Rows:** Thin bottom-border divider (`#f1f5f9`). No zebra striping, but hover states should highlight the row in a very faint blue tint.

### Sidebar Navigation
- Vertical orientation.
- Active state uses a left-aligned 4px vertical bar in Primary Blue and a subtle background tint.
- Icons should be line-art style (2px stroke) for a modern, clean look.

### Cards
- White background, 1px border, Level 1 shadow.
- Header sections within cards should be separated by a faint horizontal rule.

### Input Fields
- White background with a `#cbd5e1` border.
- On focus: border changes to `#1e40af` with a soft blue outer glow.
- Error states: border changes to `#ef4444` with a red helper text below.

### Status Chips
- **Pending:** Light orange background with dark orange text (`#f59e0b`).
- **Resolved:** Light green background with dark green text (`#10b981`).
- **Critical:** Light red background with dark red text (`#ef4444`).