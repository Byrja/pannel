#!/usr/bin/env python3
import json, re, os, datetime
from pathlib import Path

ROOT = Path('/srv/openclaw-bus')
INDEX = ROOT / 'INDEX.md'
TICKETS = ROOT / 'tickets'
OUT = Path('/srv/openclaw-bus/pannel/data/runtime.json')

projects = []

if INDEX.exists():
    lines = INDEX.read_text(encoding='utf-8', errors='ignore').splitlines()
    for ln in lines:
        if not ln.startswith('|'):
            continue
        if 'File' in ln or ln.startswith('|---'):
            continue
        parts = [p.strip() for p in ln.strip('|').split('|')]
        if len(parts) < 5:
            continue
        file, prio, status, owner, title = parts[:5]
        tpath = TICKETS / file
        completed_at = None
        if status == 'DONE' and tpath.exists():
            ts = datetime.datetime.utcfromtimestamp(tpath.stat().st_mtime)
            completed_at = ts.strftime('%Y-%m-%d %H:%M UTC')
        projects.append({
            'id': file.replace('.md',''),
            'title': title,
            'owner': owner,
            'priority': prio,
            'status': status,
            'completedAt': completed_at,
            'meta': f'Приоритет {prio}, владелец {owner}'
        })

runtime = {
    'generatedAt': datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC'),
    'projects': projects
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(runtime, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'written: {OUT} ({len(projects)} projects)')
