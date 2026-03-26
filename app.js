const $ = (id) => document.getElementById(id);

function badge(stage){
  const map={"новый":"warn","В работе":"ok","Тест":"warn","Готово":"ok","blocked":"crit"};
  const cls=map[stage]||'warn';
  return `<span class="state ${cls}">${stage}</span>`;
}

function card(title, meta, extra=''){
  return `<div class="item"><div class="title">${title}</div><div class="meta">${meta}</div>${extra}</div>`;
}

async function init(){
  const [hubRes, rtRes] = await Promise.all([
    fetch('data/hub.json'),
    fetch('data/runtime.json').catch(()=>null)
  ]);
  const hub = await hubRes.json();
  const rt = rtRes && rtRes.ok ? await rtRes.json() : null;
  $('generatedAt').textContent = rt?.generatedAt ? `· Обновлено: ${rt.generatedAt}` : '';

  $('inbox').innerHTML = hub.inbox.map(r=>card(`${r.id} ${badge(r.status)}`, r.text, `<div class="meta">${r.createdAt}</div>`)).join('');

  $('projects').innerHTML = hub.projects.map(p=>card(
    `${p.name} ${badge(p.stage)}`,
    `${p.id} · owner: ${p.owner} · ETA: ${p.eta}`,
    `<div class="progress"><div class="bar" style="width:${p.progress}%"></div></div><div class="meta">Прогресс: ${p.progress}% · Агенты: ${p.agents.join(', ')} · Результат: ${p.result}</div>`
  )).join('');

  $('agents').innerHTML = hub.agents.map(a=>card(`${a.name} ${badge(a.state==='занята'?'В работе':'новый')}`, a.task)).join('');

  $('quality').innerHTML = hub.qualityGate.map(q=>card(`${q.projectId} ${badge(q.status==='в ожидании'?'новый':'Готово')}`, q.check)).join('');

  $('releases').innerHTML = hub.releases.length
    ? hub.releases.map(r=>card(r.projectId, `${r.date} · ${r.note}`)).join('')
    : card('Пока пусто', 'Релизы появятся после прохождения quality gate');
}

init();
