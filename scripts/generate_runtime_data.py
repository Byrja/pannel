#!/usr/bin/env python3
import json, datetime, subprocess
from pathlib import Path

ROOT = Path('/srv/openclaw-bus')
INDEX = ROOT / 'INDEX.md'
TICKETS = ROOT / 'tickets'
OUT = Path('/srv/openclaw-bus/pannel/data/runtime.json')


def sh(cmd: str) -> str:
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.DEVNULL).strip()
    except Exception:
        return ""


def service_state(name: str) -> str:
    out = sh(f"systemctl is-active {name}")
    return out if out else "unknown"


def user_service_state(user: str, unit: str) -> str:
    cmd = f"systemctl --user --machine={user}@ is-active {unit}"
    out = sh(cmd)
    return out if out else "unknown"


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
            'id': file.replace('.md', ''),
            'title': title,
            'owner': owner,
            'priority': prio,
            'status': status,
            'completedAt': completed_at,
            'meta': f'Приоритет {prio}, владелец {owner}'
        })

services = {
    "klavaGateway": user_service_state("claw", "openclaw-gateway"),
    "iskraGateway": user_service_state("claw2", "openclaw-gateway"),
    "vpnBot": service_state("vpn-bot.service"),
}

runtime = {
    'generatedAt': datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC'),
    'projects': projects,
    'services': services,
    'dataStatus': {
        'projects': 'live',
        'services': 'live',
        'vpnUsers': 'pending:PANEL-VPN-001',
        'vpnTraffic': 'pending:PANEL-VPN-002',
        'referrals': 'pending:PANEL-VPN-003',
        'incidents': 'pending:PANEL-VPN-004'
    }
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(runtime, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'written: {OUT} ({len(projects)} projects)')
