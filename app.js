const $ = (id) => document.getElementById(id);

let briefMode = true;

function setMode(brief) {
  briefMode = brief;
  $('view-brief').classList.toggle('active', brief);
  $('view-list').classList.toggle('active', !brief);
  renderTasks(window.__data.tasks);
}

function renderServices(services) {
  $('services').innerHTML = services
    .map(
      (s) => `<div class="svc"><div>${s.name}</div><div class="state ${s.state}">${s.text}</div></div>`
    )
    .join('');
}

function renderAlerts(alerts) {
  $('alerts').innerHTML = alerts.map((a) => `<li>${a}</li>`).join('');
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

function renderOwner(tasks) {
  $('ownerTasks').innerHTML = tasks.map((t) => `<li>${t}</li>`).join('');
}

function renderAgents(agents) {
  $('agents').innerHTML = agents
    .map(
      (a) => `<div class="agent"><div class="avatar">${a.initials}</div><div><div><b>${a.name}</b> · ${a.status}</div><div class="meta">${a.role}</div></div></div>`
    )
    .join('');
}

async function init() {
  const res = await fetch('data/projects.json');
  const data = await res.json();
  window.__data = data;

  renderServices(data.services);
  renderAlerts(data.alerts);
  renderTasks(data.tasks);
  renderOwner(data.ownerTasks);
  renderAgents(data.agents);

  $('view-brief').addEventListener('click', () => setMode(true));
  $('view-list').addEventListener('click', () => setMode(false));
}

init();
