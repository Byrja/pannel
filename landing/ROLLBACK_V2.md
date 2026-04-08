# Landing v2 — Rollback Note

If release causes regressions, rollback immediately to freeze state.

## Fast rollback plan
1. Restore baseline files from freeze commit/artifact:
   - `landing/index.html`
   - `landing/styles.css`
   - `landing/main.js`
2. Redeploy static assets.
3. Run quick smoke:
   - Hero CTA works
   - Sticky CTA works
   - No broken layout on mobile

## Suggested command pattern
Use your existing deploy mechanism and pin previous known-good commit for `pannel/landing`.

## Freeze reference
- `landing/FREEZE_V1.md`
- release notes: `landing/RELEASE_NOTES_V1.md`
