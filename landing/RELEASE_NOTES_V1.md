# Landing Release Notes v1

Date: 2026-04-06
URL: https://bur-panel.duckdns.org/landing

## Included
- Modern RU landing (hero, trust block, steps, pricing, FAQ, final CTA)
- Mobile sticky CTA
- CTA source markers via Telegram `start` params:
  - `landing_nav`
  - `landing_hero`
  - `landing_final`
  - `landing_sticky`

## Offer
- 40 Stars / 30 days
- SBP 100 RUB — soon

## QA pass (manual)
- [x] Page opens via HTTPS
- [x] Main CTA opens Telegram bot
- [x] Mobile sticky CTA visible on narrow width
- [x] Desktop and mobile readable typography
- [x] No placeholder/garbage text

## Deferred
- A/B copy tests for CTA variants
- click analytics dashboard
- additional trust proof block (real testimonials)

## Rollback
- Previous commit before v2 polish: `6696b03`
- Previous baseline v1: `39c3dcd`
