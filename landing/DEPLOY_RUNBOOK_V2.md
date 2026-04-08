# Landing v2 — Deploy Runbook (5-step)

## 0) Preconditions
- Repo: `/srv/openclaw-bus/pannel`
- Branch: `main`
- Landing path: `landing/`

## 1) Precheck
```bash
cd /srv/openclaw-bus/pannel
git status --short
```
Expected: no unexpected local conflicts for deploy target.

## 2) Sync & build artifact (static)
```bash
cd /srv/openclaw-bus/pannel
git pull --ff-only
# If you use a static copy/deploy script, run it here.
```

## 3) Deploy
```bash
# Use your current deploy method for bur-panel.duckdns.org/landing
# (rsync/scp/system service/static host sync)
```

## 4) Post-deploy smoke (mandatory)
- Open `https://bur-panel.duckdns.org/landing`
- Check CTA routes:
  - `landing_nav`
  - `landing_hero`
  - `landing_final`
  - `landing_sticky`
- Check mobile width 390px (no overlap)
- Check FAQ visible

## 5) Fast rollback
If smoke fails:
```bash
cd /srv/openclaw-bus/pannel
git checkout 6696b03 -- landing/index.html landing/styles.css landing/main.js
# redeploy same way as step 3
```
Then rerun smoke.

## References
- `landing/SMOKE_CHECKLIST_V2.md`
- `landing/ROLLBACK_V2.md`
- `landing/RELEASE_NOTES_V1.md`
