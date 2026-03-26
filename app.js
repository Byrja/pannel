async function load() {
  const res = await fetch('data/projects.json');
  const data = await res.json();

  const health = document.getElementById('health-list');
  data.coreHealth.forEach((h) => {
    const li = document.createElement('li');
    li.textContent = `${h.name}: ${h.state}`;
    health.appendChild(li);
  });

  const body = document.getElementById('projects-body');
  data.projects.forEach((p) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.id}</td><td>${p.title}</td><td>${p.owner}</td><td>${p.status}</td><td>${p.class}</td><td>${p.notes}</td>`;
    body.appendChild(tr);
  });

  const ownerTasks = document.getElementById('owner-tasks');
  data.ownerTasks.forEach((t) => {
    const li = document.createElement('li');
    li.textContent = `${t.title} — ${t.status}`;
    ownerTasks.appendChild(li);
  });
}

load();
