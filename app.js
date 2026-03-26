const $ = (id) => document.getElementById(id);
let briefMode = true;

function setMode(brief) {
  briefMode = brief;
  $('view-brief').classList.toggle('active', brief);
  $('view-list').classList.toggle('active', !brief);
  renderTasks(window.__tasks);
}

function renderServices(services) {
  $('services').innerHTML = services
    .map((s) => `<div class="svc"><div>${s.name}</div><div class="state ${s.state}">${s.text}</div></div>`)
    .join('');
}

function renderAlerts(alerts) {
  $('alerts').innerHTML = alerts.map((a) => `<li>${a}</li>`).join('');
}

function toBoard(projects) {
  const board = { backlog: [], inProgress: [], review: [], done: [] };
  for (const p of projects) {
    const t = { id: p.id, title: p.title, meta: p.completedAt ? `Выполнено: ${p.completedAt}` : p.meta };
    if (p.status === 'DONE') board.done.push(t);
    else if (p.status === 'IN_PROGRESS') board.inProgress.push(t);
    else if (p.status === 'REVIEW') board.review.push(t);
    else board.backlog.push(t);
  }
  return board;
}

function taskCard(t) {
  if (briefMode) {
    return `<div class="task"><div class="id">${t.id}</div><div class="title">${t.title}</div><div class="meta"><b>Было:</b> задача не завершена<br/><b>Что делаем:</b> ${t.meta}<br/><b>Будет:</b> прозрачный статус в панели</div></div>`;
  }
  return `<div class="task"><div class="id">${t.id}</div><div class="title">${t.title}</div><div class="meta">• ${t.meta}</div></div>`;
}

function renderTasks(tasks) {
  const map = [
    ['Бэклог', tasks.backlog],
    ['В работе', tasks.inProgress],
    ['На проверке', tasks.review],
    ['Готово', tasks.done]
  ];
  $('kanban').innerHTML = map
    .map(([title, arr]) => `<div class="col"><h3>${title}</h3>${arr.map(taskCard).join('')}</div>`)
    .join('');
}

function getOwnerTasks() {
  const custom = JSON.parse(localStorage.getItem('ownerTasks') || '[]');
  return [...(window.__defaultOwnerTasks || []), ...custom];
}

function renderOwner() {
  const tasks = getOwnerTasks();
  $('ownerTasks').innerHTML = tasks
    .map((t, i) => `<li class="task-owner"><span>${t}</span>${i >= (window.__defaultOwnerTasks||[]).length ? `<button data-del="${i-(window.__defaultOwnerTasks||[]).length}">x</button>` : ''}</li>`)
    .join('');
  $('ownerTasks').querySelectorAll('button[data-del]').forEach((b) => {
    b.addEventListener('click', () => {
      const idx = Number(b.dataset.del);
      const custom = JSON.parse(localStorage.getItem('ownerTasks') || '[]');
      custom.splice(idx, 1);
      localStorage.setItem('ownerTasks', JSON.stringify(custom));
      renderOwner();
    });
  });
}

function renderAgents(agents) {
  $('agents').innerHTML = agents
    .map((a) => `<div class="agent"><div class="avatar">${a.initials}</div><div><div><b>${a.name}</b> · ${a.status}</div><div class="meta">${a.role}</div></div></div>`)
    .join('');
}

async function init() {
  const [staticRes, runtimeRes] = await Promise.all([
    fetch('data/projects.json'),
    fetch('data/runtime.json').catch(() => null)
  ]);
  const base = await staticRes.json();
  const runtime = runtimeRes && runtimeRes.ok ? await runtimeRes.json() : { projects: [], generatedAt: null };

  renderServices(base.services);
  renderAlerts(base.alerts);

  window.__tasks = runtime.projects.length ? toBoard(runtime.projects) : base.tasks;
  renderTasks(window.__tasks);

  window.__defaultOwnerTasks = base.ownerTasks || [];
  renderOwner();
  renderAgents(base.agents);

  $('generatedAt').textContent = runtime.generatedAt ? `· Обновлено: ${runtime.generatedAt}` : '';

  $('view-brief').addEventListener('click', () => setMode(true));
  $('view-list').addEventListener('click', () => setMode(false));

  $('ownerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('ownerInput');
    const val = input.value.trim();
    if (!val) return;
    const custom = JSON.parse(localStorage.getItem('ownerTasks') || '[]');
    custom.push(val);
    localStorage.setItem('ownerTasks', JSON.stringify(custom));
    input.value = '';
    renderOwner();
  });
}

init();
