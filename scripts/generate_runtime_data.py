#!/usr/bin/env python3
import json, datetime, subprocess, time
from pathlib import Path

ROOT = Path('/srv/openclaw-bus')
INDEX = ROOT / 'INDEX.md'
TICKETS = ROOT / 'tickets'
PEERS = ROOT / 'vpn-bot' / 'state' / 'peers.json'
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


def build_projects():
    projects = []
    if not INDEX.exists():
        return projects
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
    return projects


def build_vpn_stats():
    now = int(time.time())
    stats = {
        'usersTotal': None,
        'usersActive': None,
        'usersExpired': None,
        'onlineRecent10m': None,
    }
    notes = []
    if not PEERS.exists():
        notes.append('users: данные будут добавлены в рамках задачи PANEL-VPN-001')
        return stats, notes
    try:
        data = json.loads(PEERS.read_text(encoding='utf-8'))
        if not isinstance(data, dict):
            notes.append('users: формат peers.json неожиданный, нужна адаптация PANEL-VPN-001')
            return stats, notes
        users = list(data.values())
        stats['usersTotal'] = len(users)
        active = sum(1 for u in users if isinstance(u, dict) and u.get('status') == 'active')
        expired = sum(1 for u in users if isinstance(u, dict) and u.get('status') == 'expired')
        online = sum(1 for u in users if isinstance(u, dict) and isinstance(u.get('last_seen'), int) and now - u.get('last_seen') <= 600)
        stats['usersActive'] = active
        stats['usersExpired'] = expired
        stats['onlineRecent10m'] = online
    except Exception:
        notes.append('users: ошибка чтения peers.json, нужно исправление в PANEL-VPN-001')

    notes.append('traffic: данные будут добавлены в рамках задачи PANEL-VPN-002')
    notes.append('referrals: данные будут добавлены в рамках задачи PANEL-VPN-003')
    notes.append('incidents: данные будут добавлены в рамках задачи PANEL-VPN-004')
    return stats, notes


projects = build_projects()
services = {
    "klavaGateway": user_service_state("claw", "openclaw-gateway"),
    "iskraGateway": user_service_state("claw2", "openclaw-gateway"),
    "vpnBot": service_state("vpn-bot.service"),
}
vpn_stats, vpn_notes = build_vpn_stats()

runtime = {
    'generatedAt': datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC'),
    'projects': projects,
    'services': services,
    'vpn': {
        'stats': vpn_stats,
        'notes': vpn_notes
    }
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(runtime, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'written: {OUT} ({len(projects)} projects)')
