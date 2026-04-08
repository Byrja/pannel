# Landing v2 — Smoke Checklist

Date (UTC): 2026-04-08
Owner: Клава

## CTA / routing
- [x] `landing_nav` opens `@deepbur_byrbot`
- [x] `landing_hero` opens `@deepbur_byrbot`
- [x] `landing_final` opens `@deepbur_byrbot`
- [x] `landing_sticky` opens `@deepbur_byrbot`

## UI / UX
- [x] Hero copy matches `CONTENT_LOCK_V2.md`
- [x] FAQ block rendered and readable
- [x] Sticky CTA visible on mobile viewport
- [x] No overlapping critical blocks at 390px

## Accessibility baseline
- [x] CTA links have aria-labels
- [x] Focus-visible state present for keyboard navigation
- [x] FAQ section has semantic label

## Notes
- Manual smoke passed for landing structure and CTA tags.
- Next: production deploy + post-deploy click-through verification from real device.
