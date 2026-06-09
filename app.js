/* =========================================================================
   ServiceCore · by GT Core — App (SPA sem dependências)
   Roteamento, views, drawer de OS com timeline, busca e filtros.
   ========================================================================= */

(() => {
  "use strict";

  // ---------- Formatadores & helpers ----------
  const fmtDate = (iso) => {
    const d = new Date((iso.length > 10 ? iso.replace(" ", "T") : iso + "T00:00:00"));
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };
  const fmtDateLong = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- Ícones ----------
  const ICON = {
    open:    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/></svg>',
    assign:  '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.8"/><path d="M5 20a7 7 0 0114 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    visit:   '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.8"/></svg>',
    wait:    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    fix:     '<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5a3.5 3.5 0 00-4.9 4.4L4 15.5V20h4.5l5.6-5.6a3.5 3.5 0 004.4-4.9l-2.5 2.5-2.1-.6-.6-2.1 2.5-2.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    close:   '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock:   '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    user:    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.8"/><path d="M5 20a7 7 0 0114 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    alert:   '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l9 16H3l9-16z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    check:   '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    folder:  '<svg viewBox="0 0 24 24" fill="none"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" stroke-width="1.8"/></svg>',
    spin:    '<svg viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 11-9-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    field:   '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.2" stroke="currentColor" stroke-width="1.8"/></svg>',
    sla:     '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    cal:     '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    bolt:    '<svg viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    gear:    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  };

  // ---------- Status / prioridade ----------
  const STATUS = {
    aberta:     ["badge--purple", "Aberta", "open"],
    andamento:  ["badge--blue", "Em andamento", "spin"],
    aguardando: ["badge--amber", "Aguardando peça", "wait"],
    concluida:  ["badge--green", "Concluída", "close"],
  };
  const statusBadge = (s) => { const [c, l] = STATUS[s]; return `<span class="badge ${c}">${l}</span>`; };
  const PRIO = { baixa: "Baixa", media: "Média", alta: "Alta", critica: "Crítica" };
  const prioTag = (p) => `<span class="prio prio--${p}"><span class="prio__dot"></span>${PRIO[p]}</span>`;

  const techAvatar = (t) =>
    `<span class="tech"><span class="tech__av" style="background:${t.color}">${t.initials}</span>${esc(t.name)}</span>`;

  const TL_COLOR = { open: "#7C3AED", assign: "#3B82F6", visit: "#F59E0B", wait: "#F59E0B", fix: "#22C55E", close: "#22C55E" };
  const TL_BG = { open: "var(--primary-soft)", assign: "#E8EFFD", visit: "#FEF3DC", wait: "#FEF3DC", fix: "#DCFCE7", close: "#DCFCE7" };

  // ===================================================================
  //  Gráfico de barras (atendimentos por semana)
  // ===================================================================
  function weekChart(data) {
    const W = 620, H = 220, pad = { t: 16, r: 12, b: 30, l: 34 };
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const max = Math.max(...data.map((d) => d.value)) * 1.15;
    const y = (v) => pad.t + ih - (v / max) * ih;
    const slot = iw / data.length;
    const bw = Math.min(40, slot * 0.5);

    let grid = "", yl = "";
    for (let g = 0; g <= 3; g++) {
      const gy = pad.t + (ih * g) / 3;
      grid += `<line class="grid-line" x1="${pad.l}" y1="${gy}" x2="${W - pad.r}" y2="${gy}"/>`;
      yl += `<text class="axis-label" x="${pad.l - 8}" y="${gy + 4}" text-anchor="end">${Math.round(max - (max * g) / 3)}</text>`;
    }
    const bars = data.map((d, i) => {
      const cx = pad.l + slot * i + slot / 2;
      const h = (d.value / max) * ih, yy = y(d.value);
      return `<rect class="bar-rect" x="${(cx - bw / 2).toFixed(1)}" y="${yy.toFixed(1)}" width="${bw}" height="${Math.max(h,1).toFixed(1)}" rx="6" fill="url(#barGrad)"><title>${d.day}: ${d.value} atendimentos</title></rect>
        <text class="axis-label" x="${cx}" y="${H - 9}" text-anchor="middle">${d.day}</text>`;
    }).join("");

    return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Atendimentos por semana">
      <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--primary-2)"/><stop offset="100%" stop-color="var(--primary)"/>
      </linearGradient></defs>
      ${grid}${yl}${bars}
    </svg>`;
  }

  // ===================================================================
  //  Componentes
  // ===================================================================
  const kpiCard = ({ label, value, icon, sub, variant = "" }) => `
    <div class="card kpi ${variant}">
      <div class="kpi__top"><span class="kpi__label">${label}</span><span class="kpi__icon">${icon}</span></div>
      <div class="kpi__value">${value}</div>
      <div class="kpi__sub">${sub}</div>
    </div>`;

  const ordersTableRows = (rows) => rows.map((o) => {
    const c = SC.clientById(o.clientId), t = SC.techById(o.techId), e = SC.equipById(o.equipId);
    return `<tr class="clickable" data-os="${o.os}">
      <td class="cell-id">${o.os}</td>
      <td class="strong">${esc(c.name)}</td>
      <td>${techAvatar(t)}</td>
      <td>${esc(e.type)}</td>
      <td>${prioTag(o.priority)}</td>
      <td>${statusBadge(o.status)}</td>
    </tr>`;
  }).join("");

  const ordersTable = (rows) => `
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>OS</th><th>Cliente</th><th>Técnico</th><th>Equipamento</th><th>Prioridade</th><th>Status</th></tr></thead>
      <tbody>${rows.length ? ordersTableRows(rows) : `<tr><td colspan="6"><div class="empty">Nenhuma ordem encontrada.</div></td></tr>`}</tbody>
    </table></div>`;

  // ===================================================================
  //  VIEWS
  // ===================================================================
  const views = {};

  // ---------- Dashboard ----------
  views.dashboard = () => {
    const m = SC.metrics();
    const upcoming = [...SC.schedule].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 5);
    return `
    <div class="grid grid--kpi">
      ${kpiCard({ label: "Ordens abertas", value: m.open, icon: ICON.open, variant: "kpi--p", sub: "aguardando atendimento" })}
      ${kpiCard({ label: "Em andamento", value: m.inProgress, icon: ICON.spin, variant: "kpi--w", sub: "sendo executadas" })}
      ${kpiCard({ label: "Concluídas", value: m.done, icon: ICON.close, variant: "kpi--g", sub: "no período" })}
      ${kpiCard({ label: "Técnicos em campo", value: m.techsInField, icon: ICON.field, variant: "kpi--p", sub: `de ${SC.technicians.length} disponíveis` })}
      ${kpiCard({ label: "SLA médio", value: m.slaAvg + "%", icon: ICON.sla, variant: "kpi--g", sub: "dentro do prazo" })}
      ${kpiCard({ label: "Atendimentos do dia", value: m.today, icon: ICON.cal, variant: "kpi--p", sub: "agendados para hoje" })}
    </div>

    <div class="grid grid--main mt">
      <div class="card">
        <div class="card__head"><h3>Atendimentos por semana</h3><span class="muted">Últimos 7 dias</span></div>
        ${weekChart(SC.weekly)}
      </div>
      <div class="card">
        <div class="card__head"><h3>Atividades recentes</h3></div>
        <div class="feed">
          ${SC.activity.map((a) => `
            <div class="feed__item">
              <span class="feed__dot" style="background:${TL_BG[a.type]};color:${TL_COLOR[a.type]}">${ICON[a.type] || ICON.open}</span>
              <div><div class="feed__text">${esc(a.text)}</div><div class="feed__time">${a.time}</div></div>
            </div>`).join("")}
        </div>
      </div>
    </div>

    <div class="grid grid--2 mt">
      <div class="card">
        <div class="card__head"><h3>Ordens prioritárias</h3><span class="muted">alta e crítica</span></div>
        ${ordersTable(SC.orders.filter((o) => (o.priority === "alta" || o.priority === "critica") && o.status !== "concluida"))}
      </div>
      <div class="card">
        <div class="card__head"><h3>Próximas visitas</h3><a class="muted" href="#agenda" data-goto="agenda" style="cursor:pointer">Ver agenda →</a></div>
        <div class="feed">
          ${upcoming.map((v) => {
            const c = SC.clientById(v.clientId), t = SC.techById(v.techId);
            return `<div class="feed__item" data-os="${v.os}" style="cursor:pointer">
              <span class="tech__av" style="background:${t.color};width:30px;height:30px;border-radius:9px">${t.initials}</span>
              <div style="flex:1">
                <div class="feed__text">${esc(c.name)} <span class="cell-id" style="font-size:.74rem">${v.os}</span></div>
                <div class="feed__time">${fmtDate(v.date)} · ${v.time} · ${esc(t.name)}</div>
              </div>
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>`;
  };

  // ---------- Ordens de Serviço ----------
  const osFilters = [
    { key: "todas", label: "Todas" },
    { key: "aberta", label: "Abertas" },
    { key: "andamento", label: "Em andamento" },
    { key: "aguardando", label: "Aguardando peça" },
    { key: "concluida", label: "Concluídas" },
  ];
  let osFilter = "todas";

  views.ordens = () => {
    const filtered = osFilter === "todas" ? SC.orders : SC.orders.filter((o) => o.status === osFilter);
    return `
    <div class="section-head">
      <div><h2>Ordens de Serviço</h2><p>Clique em uma OS para ver os detalhes e o histórico de atendimento.</p></div>
    </div>
    <div class="chips" id="osChips">
      ${osFilters.map((f) => {
        const count = f.key === "todas" ? SC.orders.length : SC.orders.filter((o) => o.status === f.key).length;
        return `<button class="chip ${f.key === osFilter ? "is-active" : ""}" data-filter="${f.key}">${f.label}<span class="chip__count">${count}</span></button>`;
      }).join("")}
    </div>
    <div class="card mt">${ordersTable(filtered)}</div>`;
  };

  // ---------- Clientes ----------
  let clientQuery = "", clientCity = "todas";
  views.clientes = () => {
    const cities = ["todas", ...new Set(SC.clients.map((c) => c.city))];
    const q = clientQuery.toLowerCase();
    const list = SC.clients.filter((c) =>
      (clientCity === "todas" || c.city === clientCity) &&
      (c.name.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q))
    );
    return `
    <div class="section-head"><div><h2>Clientes</h2><p>${SC.clients.length} clientes ativos</p></div></div>
    <div class="card" style="margin-bottom:18px">
      <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">
        <div class="searchbox" style="flex:1;min-width:220px;display:flex">
          <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <input type="text" id="clientSearch" placeholder="Buscar por nome ou segmento…" value="${esc(clientQuery)}" />
        </div>
        <div class="chips" id="cityChips">
          ${cities.map((c) => `<button class="chip ${c === clientCity ? "is-active" : ""}" data-city="${esc(c)}">${c === "todas" ? "Todas as cidades" : esc(c)}</button>`).join("")}
        </div>
      </div>
    </div>
    ${list.length ? `<div class="entity-grid">${list.map(clientCard).join("")}</div>` : `<div class="empty">Nenhum cliente encontrado.</div>`}`;
  };

  const clientCard = (c) => {
    const initials = c.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    return `<div class="entity-card" data-client="${c.id}">
      <div class="entity-card__top">
        <div class="entity-card__av">${initials}</div>
        <div><div class="entity-card__name">${esc(c.name)}</div><div class="entity-card__sub">${esc(c.segment)} · ${esc(c.city)}</div></div>
      </div>
      <div class="entity-card__meta">
        <div><div class="metaval">${c.visits}</div><div class="metalbl">Atendimentos</div></div>
        <div style="text-align:right"><div class="metaval" style="font-size:.92rem">${fmtDate(c.last)}</div><div class="metalbl">Último atendimento</div></div>
      </div>
    </div>`;
  };

  // ---------- Equipamentos ----------
  views.equipamentos = () => `
    <div class="section-head"><div><h2>Equipamentos</h2><p>${SC.equipment.length} equipamentos monitorados</p></div></div>
    <div class="card">
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th>Tipo</th><th>Modelo</th><th>Nº de série</th><th>Cliente</th><th class="num">Falhas</th><th>Última manutenção</th></tr></thead>
        <tbody>
          ${SC.equipment.map((e) => {
            const c = SC.clientById(e.clientId);
            const hot = e.failures >= 4;
            return `<tr class="clickable" data-equip="${e.id}">
              <td><span class="badge badge--gray">${esc(e.type)}</span></td>
              <td class="strong">${esc(e.model)}</td>
              <td class="cell-id" style="color:var(--muted)">${esc(e.serial)}</td>
              <td>${esc(c.name)}</td>
              <td class="num"><span class="badge ${hot ? "badge--red" : "badge--green"}">${e.failures}</span></td>
              <td>${fmtDate(e.lastService)}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table></div>
    </div>`;

  // ---------- Agenda Técnica ----------
  views.agenda = () => {
    const days = [...new Set(SC.schedule.map((s) => s.date))].sort();
    return `
    <div class="section-head"><div><h2>Agenda Técnica</h2><p>Visitas programadas e técnicos responsáveis</p></div></div>
    ${days.map((day) => {
      const visits = SC.schedule.filter((s) => s.date === day).sort((a, b) => a.time.localeCompare(b.time));
      return `<div class="agenda-day">
        <div class="agenda-day__head">
          <span class="agenda-day__date">${cap(fmtDateLong(day))}</span>
          <span class="agenda-day__count">${visits.length} visita${visits.length > 1 ? "s" : ""}</span>
        </div>
        ${visits.map((v) => {
          const c = SC.clientById(v.clientId), t = SC.techById(v.techId), e = SC.equipById(v.equipId);
          return `<div class="visit" data-os="${v.os}" style="cursor:pointer">
            <div class="visit__time">${v.time}</div>
            <div class="visit__bar" style="background:${t.color}"></div>
            <div class="visit__info">
              <div class="visit__client">${esc(c.name)} <span class="cell-id" style="font-size:.74rem">${v.os}</span></div>
              <div class="visit__detail">${esc(e.type)} · ${esc(e.model)}</div>
            </div>
            ${techAvatar(t)}
          </div>`;
        }).join("")}
      </div>`;
    }).join("")}`;
  };

  // ---------- Produtividade ----------
  views.produtividade = () => {
    const m = SC.metrics();
    const maxJobs = Math.max(...SC.technicians.map((t) => t.jobs));
    return `
    <div class="section-head"><div><h2>Painel de Produtividade</h2><p>Indicadores operacionais da equipe técnica</p></div></div>
    <div class="grid grid--4">
      ${kpiCard({ label: "Técnico mais produtivo", value: m.topTech.name.split(" ")[0], icon: ICON.user, variant: "kpi--p", sub: `${m.topTech.jobs} ordens concluídas` })}
      ${kpiCard({ label: "Tempo médio de atendimento", value: m.avgTime.toFixed(1) + "h", icon: ICON.clock, variant: "kpi--w", sub: "por ordem de serviço" })}
      ${kpiCard({ label: "Resolução na 1ª visita", value: m.firstFix + "%", icon: ICON.check, variant: "kpi--g", sub: "first-time fix rate" })}
      ${kpiCard({ label: "Equip. com mais falhas", value: m.worstEquip.type, icon: ICON.alert, variant: "kpi--e", sub: `${m.worstEquip.model} · ${m.worstEquip.failures} falhas` })}
    </div>

    <div class="grid grid--2 mt">
      <div class="card">
        <div class="card__head"><h3>Ranking de técnicos</h3><span class="muted">ordens concluídas</span></div>
        <div class="mini-list">
          ${[...SC.technicians].sort((a, b) => b.jobs - a.jobs).map((t, i) => `
            <div>
              <div class="rank-row" style="margin-bottom:7px">
                <span class="rank-row__pos">${i + 1}</span>
                <span class="rank-row__name">${techAvatar(t)}</span>
                <span class="rank-row__val">${t.jobs}</span>
              </div>
              <div class="bar"><span style="width:${(t.jobs / maxJobs) * 100}%"></span></div>
            </div>`).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card__head"><h3>Eficiência por técnico</h3><span class="muted">resolução na 1ª visita</span></div>
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>Técnico</th><th>Região</th><th class="num">Tempo méd.</th><th class="num">1ª visita</th></tr></thead>
          <tbody>${SC.technicians.map((t) => `
            <tr><td>${techAvatar(t)}</td><td>${esc(t.region)}</td><td class="num">${t.avgTime.toFixed(1)}h</td>
            <td class="num strong" style="color:var(--success)">${Math.round(t.firstFix * 100)}%</td></tr>`).join("")}
          </tbody>
        </table></div>
      </div>
    </div>`;
  };

  // ===================================================================
  //  Drawer — detalhe da OS + timeline
  // ===================================================================
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("drawerOverlay");

  function openOS(osId) {
    const o = SC.orders.find((x) => x.os === osId);
    if (!o) return;
    const c = SC.clientById(o.clientId), t = SC.techById(o.techId), e = SC.equipById(o.equipId);
    drawer.innerHTML = `
      <div class="drawer__head">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <span class="cell-id" style="font-size:1rem">${o.os}</span>${statusBadge(o.status)}
          </div>
          <div style="font-weight:700;font-size:1.05rem">${esc(c.name)}</div>
        </div>
        <button class="drawer__close" id="drawerClose" aria-label="Fechar">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="drawer__body">
        <div class="drawer__section">
          <h4>Descrição do chamado</h4>
          <div class="desc-box">${esc(o.desc)}</div>
        </div>
        <div class="drawer__section">
          <h4>Informações</h4>
          <div class="kv">
            <div class="kv__item"><div class="k">Técnico responsável</div><div class="v">${techAvatar(t)}</div></div>
            <div class="kv__item"><div class="k">Prioridade</div><div class="v">${prioTag(o.priority)}</div></div>
            <div class="kv__item"><div class="k">Equipamento</div><div class="v">${esc(e.type)}</div></div>
            <div class="kv__item"><div class="k">Modelo</div><div class="v">${esc(e.model)}</div></div>
            <div class="kv__item"><div class="k">Abertura</div><div class="v">${fmtDate(o.opened)}</div></div>
            <div class="kv__item"><div class="k">Prazo SLA</div><div class="v">${fmtDate(o.sla)}</div></div>
          </div>
        </div>
        <div class="drawer__section">
          <h4>Histórico de atendimento</h4>
          <div class="timeline">
            ${o.timeline.map((ev) => `
              <div class="tl-item" style="color:${TL_COLOR[ev.type]}">
                <span class="tl-item__dot" style="background:${TL_COLOR[ev.type]}"></span>
                <div class="tl-item__date">${esc(ev.date)}</div>
                <div class="tl-item__label" style="color:var(--text)">${esc(ev.label)}</div>
                <div class="tl-item__note">${esc(ev.note)}</div>
              </div>`).join("")}
          </div>
        </div>
      </div>`;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("drawerClose").addEventListener("click", closeOS);
  }
  function closeOS() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    document.body.style.overflow = "";
  }
  overlay.addEventListener("click", closeOS);

  // ===================================================================
  //  Toast
  // ===================================================================
  let toastTimer;
  function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerHTML = `<span class="toast__ic">${ICON.close}</span><span>${esc(msg)}</span>`;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("is-show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove("is-show");
      setTimeout(() => { t.hidden = true; }, 280);
    }, 2800);
  }

  // ===================================================================
  //  Modal — Nova OS
  // ===================================================================
  const modalOverlay = document.getElementById("modalOverlay");
  const modalEl = document.getElementById("modal");

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
    modalEl.innerHTML = "";
  }

  function openNewOsModal() {
    const clientOpts = SC.clients.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
    const equipOpts = SC.equipment.map((e) => {
      const c = SC.clientById(e.clientId);
      return `<option value="${e.id}">${esc(e.type)} — ${esc(e.model)} (${esc(c.name)})</option>`;
    }).join("");
    const techOpts = SC.technicians.map((t) => `<option value="${t.id}">${esc(t.name)} · ${esc(t.region)}</option>`).join("");

    modalEl.innerHTML = `
      <div class="modal__head">
        <div><h3 id="modalTitle">Nova Ordem de Serviço</h3><p>Número gerado automaticamente: <strong>${SC.nextOsId()}</strong></p></div>
        <button class="drawer__close" id="modalClose" aria-label="Fechar">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <form class="modal__body" id="osForm" novalidate>
        <div class="field" data-f="clientId">
          <label>Cliente <span class="req">*</span></label>
          <select name="clientId"><option value="">Selecione o cliente…</option>${clientOpts}</select>
          <div class="field__err">Selecione o cliente.</div>
        </div>
        <div class="field" data-f="equipId">
          <label>Equipamento <span class="req">*</span></label>
          <select name="equipId"><option value="">Selecione o equipamento…</option>${equipOpts}</select>
          <div class="field__err">Selecione o equipamento.</div>
        </div>
        <div class="field-row">
          <div class="field" data-f="techId">
            <label>Técnico responsável <span class="req">*</span></label>
            <select name="techId"><option value="">Selecione…</option>${techOpts}</select>
            <div class="field__err">Selecione o técnico.</div>
          </div>
          <div class="field" data-f="priority">
            <label>Prioridade</label>
            <select name="priority">
              <option value="baixa">Baixa</option>
              <option value="media" selected>Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
        </div>
        <div class="field" data-f="desc">
          <label>Descrição do chamado <span class="req">*</span></label>
          <textarea name="desc" placeholder="Descreva o problema relatado pelo cliente…"></textarea>
          <div class="field__err">Descreva o chamado.</div>
        </div>
      </form>
      <div class="modal__foot">
        <button class="btn btn--ghost" id="osCancel" type="button">Cancelar</button>
        <button class="btn btn--primary" id="osSubmit" type="button">Abrir OS</button>
      </div>`;

    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("modalClose").addEventListener("click", closeModal);
    document.getElementById("osCancel").addEventListener("click", closeModal);
    document.getElementById("osSubmit").addEventListener("click", submitOs);
    // limpa o estado de erro ao alterar um campo
    modalEl.querySelectorAll("[data-f] select, [data-f] textarea").forEach((el) =>
      el.addEventListener("input", () => el.closest("[data-f]").classList.remove("invalid")));
    const first = modalEl.querySelector("select");
    if (first) first.focus();
  }

  function submitOs() {
    const form = document.getElementById("osForm");
    const required = ["clientId", "equipId", "techId", "desc"];
    let ok = true;
    required.forEach((name) => {
      const field = modalEl.querySelector(`[data-f="${name}"]`);
      const val = form.elements[name].value.trim();
      if (!val) { field.classList.add("invalid"); ok = false; }
      else field.classList.remove("invalid");
    });
    if (!ok) return;

    const order = SC.createOrder({
      clientId: form.elements.clientId.value,
      equipId: form.elements.equipId.value,
      techId: form.elements.techId.value,
      priority: form.elements.priority.value,
      desc: form.elements.desc.value.trim(),
    });
    closeModal();
    osFilter = "todas";
    render("ordens", false);
    showToast(`${order.os} aberta com sucesso`);
    openOS(order.os);
  }

  modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });

  // ESC fecha drawer e modal
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!modalOverlay.hidden) closeModal();
    else closeOS();
  });

  // ===================================================================
  //  Busca global
  // ===================================================================
  const gSearch = document.getElementById("globalSearch");
  let gResults = null;

  function clearSearch() { if (gResults) { gResults.remove(); gResults = null; } }

  function runSearch(raw) {
    const q = raw.trim().toLowerCase();
    clearSearch();
    if (!q) return;

    const osMatches = SC.orders.filter((o) => {
      const c = SC.clientById(o.clientId), t = SC.techById(o.techId), e = SC.equipById(o.equipId);
      return [o.os, c.name, t.name, e.type, e.model, e.serial].join(" ").toLowerCase().includes(q);
    }).slice(0, 6);
    const clientMatches = SC.clients.filter((c) =>
      `${c.name} ${c.segment} ${c.city}`.toLowerCase().includes(q)).slice(0, 4);

    let html = "";
    if (osMatches.length) {
      html += `<div class="search-results__group">Ordens de Serviço</div>`;
      html += osMatches.map((o) => {
        const c = SC.clientById(o.clientId), e = SC.equipById(o.equipId);
        return `<div class="search-results__item" data-os="${o.os}">
          <span class="sr-ic">${ICON.folder}</span>
          <div class="sr-main"><div class="sr-title">${o.os} · ${esc(c.name)}</div>
          <div class="sr-sub">${esc(e.type)} · ${STATUS[o.status][1]}</div></div></div>`;
      }).join("");
    }
    if (clientMatches.length) {
      html += `<div class="search-results__group">Clientes</div>`;
      html += clientMatches.map((c) => `<div class="search-results__item" data-client="${c.id}">
        <span class="sr-ic">${ICON.user}</span>
        <div class="sr-main"><div class="sr-title">${esc(c.name)}</div>
        <div class="sr-sub">${esc(c.segment)} · ${esc(c.city)} · ${c.visits} atend.</div></div></div>`).join("");
    }
    if (!html) html = `<div class="search-results__empty">Nada encontrado para “${esc(raw.trim())}”.</div>`;

    gResults = document.createElement("div");
    gResults.className = "search-results";
    gResults.innerHTML = html;
    gSearch.closest(".searchbox").appendChild(gResults);

    // mousedown + preventDefault: dispara antes do blur do input
    gResults.querySelectorAll("[data-os]").forEach((el) =>
      el.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        openOS(el.dataset.os); gSearch.value = ""; clearSearch(); gSearch.blur();
      }));
    gResults.querySelectorAll("[data-client]").forEach((el) =>
      el.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        const c = SC.clientById(el.dataset.client);
        clientQuery = c.name; clientCity = "todas"; render("clientes");
        gSearch.value = ""; clearSearch();
      }));
  }

  gSearch.addEventListener("input", (e) => runSearch(e.target.value));
  gSearch.addEventListener("focus", (e) => { if (e.target.value.trim()) runSearch(e.target.value); });
  gSearch.addEventListener("blur", () => setTimeout(clearSearch, 120));
  gSearch.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { gSearch.value = ""; clearSearch(); gSearch.blur(); }
  });

  // ===================================================================
  //  Roteamento
  // ===================================================================
  const TITLES = {
    dashboard:     ["Dashboard", "Indicadores operacionais em tempo real"],
    ordens:        ["Ordens de Serviço", "Gerencie e acompanhe todos os chamados"],
    clientes:      ["Clientes", "Base de clientes e histórico de atendimentos"],
    equipamentos:  ["Equipamentos", "Cadastro e histórico de manutenção"],
    agenda:        ["Agenda Técnica", "Visitas programadas da equipe"],
    produtividade: ["Produtividade", "Indicadores de desempenho da equipe"],
  };

  const content = document.getElementById("content");
  const titleEl = document.getElementById("view-title");
  const subEl = document.getElementById("view-subtitle");
  const navButtons = document.querySelectorAll(".nav__item");

  function bindViewEvents(view) {
    // linhas de OS (ordens, dashboard)
    content.querySelectorAll("[data-os]").forEach((el) =>
      el.addEventListener("click", () => openOS(el.dataset.os)));
    // atalhos de navegação interna
    content.querySelectorAll("[data-goto]").forEach((el) =>
      el.addEventListener("click", (e) => { e.preventDefault(); render(el.dataset.goto); }));
    // filtros de OS
    if (view === "ordens") {
      content.querySelectorAll("#osChips .chip").forEach((ch) =>
        ch.addEventListener("click", () => { osFilter = ch.dataset.filter; render("ordens", false); }));
    }
    // clientes: busca + cidade
    if (view === "clientes") {
      const search = document.getElementById("clientSearch");
      if (search) search.addEventListener("input", (e) => {
        clientQuery = e.target.value;
        render("clientes", false);
        const s = document.getElementById("clientSearch");
        if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
      });
      content.querySelectorAll("#cityChips .chip").forEach((ch) =>
        ch.addEventListener("click", () => { clientCity = ch.dataset.city; render("clientes", false); }));
      content.querySelectorAll("[data-client]").forEach((el) =>
        el.addEventListener("click", () => {
          const c = SC.clientById(el.dataset.client);
          // abre uma OS recente do cliente, se houver
          const os = SC.orders.find((o) => o.clientId === c.id);
          if (os) openOS(os.os);
        }));
    }
    // equipamentos: abre OS vinculada
    if (view === "equipamentos") {
      content.querySelectorAll("[data-equip]").forEach((el) =>
        el.addEventListener("click", () => {
          const os = SC.orders.find((o) => o.equipId === el.dataset.equip);
          if (os) openOS(os.os);
        }));
    }
  }

  function render(view, scroll = true) {
    if (!views[view]) view = "dashboard";
    content.innerHTML = views[view]();
    const [t, s] = TITLES[view];
    titleEl.textContent = t;
    subEl.textContent = s;
    navButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
    bindViewEvents(view);
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "#" + view);
    closeSidebar();
  }

  navButtons.forEach((btn) => btn.addEventListener("click", () => render(btn.dataset.view)));
  document.getElementById("newOsBtn").addEventListener("click", openNewOsModal);

  // ---------- Sidebar mobile ----------
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  let backdrop = null;
  function openSidebar() {
    sidebar.classList.add("is-open");
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    backdrop.addEventListener("click", closeSidebar);
    document.body.appendChild(backdrop);
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    if (backdrop) { backdrop.remove(); backdrop = null; }
  }
  menuBtn.addEventListener("click", () => (sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar()));

  // ---------- Init (deep-link via hash) ----------
  const initial = (location.hash || "").replace("#", "");
  render(views[initial] ? initial : "dashboard");
})();
