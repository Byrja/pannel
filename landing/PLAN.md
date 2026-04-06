# VPN Landing Plan (modern)

Status: IN_PROGRESS
Owner: Klava

## Goal
Собрать современный лендинг для VPN-сервиса перед рекламой.

## Constraints (from Sasha)
- Язык: RU
- Тон: простой человеческий
- Тариф: 40 Stars / 30 дней
- Доп. оплата: СБП 100 ₽ — скоро
- CTA: переход в Telegram `@deepbur_byrbot`
- Дизайн: современный (не «2010-е»)

## Visual direction (modern baseline)
- Clean dark + subtle gradients
- Large readable typography
- Mobile-first responsive layout
- Soft glass cards, concise blocks
- No legacy shadows/buttons from old templates

## Execution steps
1. ✅ Create landing workspace in existing repo (`pannel/landing`)
2. ✅ Create this plan file with milestones
3. ✅ Build content structure (copy + sections)
4. ✅ Implement modern UI (HTML/CSS/JS)
5. ✅ Connect CTA to Telegram bot link
6. ✅ Deploy to `bur-panel.duckdns.org/landing`
7. ⏳ QA checklist (mobile/desktop/perf/basic SEO)
8. ⏳ Final review with Sasha

## Section structure (v1)
- Hero (offer + CTA)
- How it works (3 steps)
- Pricing (40 Stars / 30 days, SBP soon)
- Why us (stability, support, speed)
- FAQ (common issues + payments)
- Final CTA

## Done criteria for v1
- URL works publicly
- Looks modern on phone + desktop
- One clear conversion path to `@deepbur_byrbot`
- No placeholder garbage text

## Risks
- Scope creep into app/dashboard topics
- Weak copy -> low conversion

## Anti-fail
- WIP=1 (landing only)
- Commit after each meaningful step
- Report with commit hash + what to check
