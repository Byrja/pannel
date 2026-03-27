const $ = (id) => document.getElementById(id);

const STORAGE_KEY = 'burPanelHubData';

function nowUtc() {
  return new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

function badge(stage) {
  const map = { 'новый': 'warn', 'В работе': 'ok', 'Тест': 'warn', 'Готово': 'ok', 'blocked': 'crit', 'готова': 'ok', 'занята': 'warn' };
  const cls = map[stage] || 'warn';
  return `<span class="state ${cls}">${stage}</span>`;
}

function card(title, meta, extra = '') {
  return `<div class="item"><div class="title">${title}</div><div class="meta">${meta}</div>${extra}</div>`;
}

function loadPersisted(base) {
  const local = localStorage.getItem(STORAGE_KEY);
  if (!local) return base;
  try { return JSON.parse(local); } catch { return base; }
}

function savePersisted(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function render(data, generatedAt) {
  $('generatedAt').textContent = generatedAt ? `· Обновлено: ${generatedAt}` : '';

  $('inbox').innerHTML = data.inbox.length
    ? data.inbox.map((r) => card(`${r.id} ${badge(r.status)}`, r.text, `<div class="meta">${r.createdAt}</div><div class="meta"><button data-start="${r.id}">Взять в работу</button></div>`)).join('')
    : card('Пусто', 'Добавь запрос выше — и проект автоматически запустится');

  $('projects').innerHTML = data.projects.length
    ? data.projects.map((p) => card(
      `${p.name} ${badge(p.stage)}`,
      `${p.id} · owner: ${p.owner} · ETA: ${p.eta || 'уточняется'}`,
      `<div class="progress"><div class="bar" style="width:${p.progress || 5}%"></div></div><div class="meta">Прогресс: ${p.progress || 5}% · Агенты: ${(p.agents || []).join(', ') || '—'} · Результат: ${p.result || '—'}</div>`
    )).join('')
    : card('Пока пусто', 'Проекты появятся после запуска из входящего запроса');

  $('agents').innerHTML = data.agents.map((a) => card(`${a.name} ${badge(a.state)}`, a.task)).join('');

  $('quality').innerHTML = data.qualityGate.length
    ? data.qualityGate.map((q) => card(`${q.projectId} ${badge(q.status === 'в ожидании' ? 'новый' : 'Готово')}`, q.check)).join('')
    : card('Пока пусто', 'Появится после запуска проекта');

  $('releases').innerHTML = data.releases.length
    ? data.releases.map((r) => card(r.projectId, `${r.date} · ${r.note}`)).join('')
    : card('Пока пусто', 'Релизы появятся после прохождения quality gate');

  $('activity').innerHTML = data.activity.length
    ? data.activity.slice().reverse().map((a) => card(a.title, `${a.at} · ${a.meta}`)).join('')
    : card('Пока пусто', 'Лента начнет наполняться после запуска проекта');

  document.querySelectorAll('button[data-start]').forEach((b) => {
    b.addEventListener('click', () => startProjectFromInbox(data, b.dataset.start));
  });
}

function startProjectFromInbox(data, reqId) {
  const req = data.inbox.find((x) => x.id === reqId);
  if (!req) return;

  const projectId = uid('PRJ');
  const project = {
    id: projectId,
    name: req.text,
    owner: 'Клава',
    stage: 'В работе',
    progress: 15,
    eta: 'оценка в работе',
    result: '—',
    agents: ['Клава']
  };
  data.projects.unshift(project);
  req.status = 'В работе';

  data.agents = data.agents.map((a) => {
    if (a.name === 'Клава') return { ...a, state: 'занята', task: `Архитектура ${projectId}` };
    return a;
  });

  data.qualityGate.unshift({ projectId, check: 'Готово к проверке Сашей', status: 'в ожидании' });
  data.activity.push({ at: nowUtc(), title: `Проект ${projectId} запущен`, meta: `из запроса ${reqId}` });

  savePersisted(data);
  render(data, $('generatedAt').textContent.replace('· Обновлено: ', ''));
}

async function init() {
  const [hubRes, rtRes] = await Promise.all([
    fetch('data/hub.json'),
    fetch('data/runtime.json').catch(() => null)
  ]);

  const baseHub = await hubRes.json();
  const rt = rtRes && rtRes.ok ? await rtRes.json() : null;
  const generatedAt = rt?.generatedAt || '';

  const data = loadPersisted(baseHub);
  render(data, generatedAt);

  $('newRequestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('newRequestInput');
    const text = input.value.trim();
    if (!text) return;
    data.inbox.unshift({ id: uid('REQ'), text, status: 'новый', createdAt: nowUtc() });
    data.activity.push({ at: nowUtc(), title: 'Новый входящий запрос', meta: text });
    input.value = '';
    savePersisted(data);
    render(data, generatedAt);
  });
}

init();
