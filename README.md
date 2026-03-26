# Pannel (Dashboard v1)

MVP dashboard for OpenClaw Bus operations.

## Goals (v1)
- Single place to see **project portfolio status** (KEEP NOW / LATER / ARCHIVE).
- Show **core runtime health** (Claw gateway, Iskra gateway, VPN bot).
- Track **owner tasks** (Bur) such as backup API providers.
- Enforce **TEST-FIRST** marker for all VPN-related work.

## Scope now
This repo starts as a static, zero-dependency frontend prototype to move fast.
Backend/API integration comes in v2.

## Run locally
```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## File structure
- `index.html` — dashboard shell
- `styles.css` — styles
- `app.js` — rendering logic
- `data/projects.json` — current portfolio snapshot

## Next steps (v2)
1. Add API layer (read status from `/srv/openclaw-bus` index + service health).
2. Add auth and role views (Owner / Agent).
3. Add edit flows for project status and priorities.
4. Add deployment profile: test contour first, then production promote.
