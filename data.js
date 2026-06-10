/* =========================================================================
   ServiceCore · by GT Core — Camada de dados (mock)
   Plataforma de gestão de ordens de serviço e operações de campo.
   Todos os dados são fictícios, apenas para fins demonstrativos.
   ========================================================================= */

const SC = (() => {
  "use strict";

  // ---- Técnicos ---------------------------------------------------------
  const technicians = [
    { id: "T1", name: "João Mendes",     initials: "JM", region: "Zona Sul",    field: true,  avgTime: 2.4, firstFix: 0.91, jobs: 142, color: "#4F46E5" },
    { id: "T2", name: "Carla Nogueira", initials: "CN", region: "Centro",      field: true,  avgTime: 2.9, firstFix: 0.86, jobs: 128, color: "#0EA5E9" },
    { id: "T3", name: "Rafael Souza",    initials: "RS", region: "Zona Norte",  field: false, avgTime: 3.3, firstFix: 0.79, jobs: 97,  color: "#F59E0B" },
    { id: "T4", name: "Beatriz Lima",    initials: "BL", region: "Zona Oeste",  field: true,  avgTime: 2.6, firstFix: 0.88, jobs: 115, color: "#10B981" },
    { id: "T5", name: "Diego Farias",    initials: "DF", region: "Litoral",     field: false, avgTime: 3.0, firstFix: 0.82, jobs: 88,  color: "#EF4444" },
  ];
  const techById = (id) => technicians.find((t) => t.id === id);

  // ---- Clientes ---------------------------------------------------------
  const clients = [
    { id: "C1", name: "Hospital Santa Clara",     segment: "Saúde",      city: "São Paulo",     visits: 34, last: "2026-06-07" },
    { id: "C2", name: "Shopping Park Sul",        segment: "Varejo",     city: "Campinas",      visits: 28, last: "2026-06-08" },
    { id: "C3", name: "Indústria MetalForte",     segment: "Indústria",  city: "Sorocaba",      visits: 41, last: "2026-06-09" },
    { id: "C4", name: "Colégio Horizonte",        segment: "Educação",   city: "São Paulo",     visits: 12, last: "2026-05-30" },
    { id: "C5", name: "Frigorífico BoaCarne",     segment: "Indústria",  city: "Ribeirão Preto",visits: 22, last: "2026-06-06" },
    { id: "C6", name: "Data Center NorteCloud",   segment: "Tecnologia", city: "São Paulo",     visits: 47, last: "2026-06-09" },
    { id: "C7", name: "Rede Hotel Mirante",       segment: "Hotelaria",  city: "Santos",        visits: 18, last: "2026-06-04" },
    { id: "C8", name: "Supermercados BomPreço",   segment: "Varejo",     city: "Campinas",      visits: 25, last: "2026-06-05" },
  ];
  const clientById = (id) => clients.find((c) => c.id === id);

  // ---- Equipamentos -----------------------------------------------------
  const equipment = [
    { id: "E1", type: "Ar-condicionado",      model: "Carrier 60.000 BTU",   serial: "AC-60K-0192", clientId: "C1", failures: 3, lastService: "2026-06-07" },
    { id: "E2", type: "Gerador",              model: "Stemac 250 kVA",       serial: "GR-250-7741", clientId: "C3", failures: 6, lastService: "2026-06-09" },
    { id: "E3", type: "Computador",           model: "Dell OptiPlex 7090",   serial: "PC-7090-3320", clientId: "C4", failures: 1, lastService: "2026-05-30" },
    { id: "E4", type: "Impressora industrial", model: "Zebra ZT411",         serial: "IM-411-5508", clientId: "C2", failures: 2, lastService: "2026-06-08" },
    { id: "E5", type: "Ar-condicionado",      model: "LG Multi V 5",         serial: "AC-MV5-2210", clientId: "C6", failures: 4, lastService: "2026-06-09" },
    { id: "E6", type: "Gerador",              model: "Cummins 180 kVA",      serial: "GR-180-9012", clientId: "C5", failures: 2, lastService: "2026-06-06" },
    { id: "E7", type: "Computador",           model: "Lenovo ThinkCentre",   serial: "PC-TC-4471",  clientId: "C7", failures: 1, lastService: "2026-06-04" },
    { id: "E8", type: "Impressora industrial", model: "Honeywell PM45",      serial: "IM-PM45-1180", clientId: "C8", failures: 2, lastService: "2026-06-05" },
  ];
  const equipById = (id) => equipment.find((e) => e.id === id);

  // ---- Ordens de Serviço ------------------------------------------------
  // status: aberta | andamento | aguardando | concluida
  // priority: baixa | media | alta | critica
  const orders = [
    {
      os: "OS-2041", clientId: "C3", techId: "T1", equipId: "E2", priority: "critica", status: "andamento",
      opened: "2026-06-08", sla: "2026-06-10", desc: "Gerador apresentando falha intermitente na partida automática.",
      timeline: [
        { date: "2026-06-08 08:12", label: "Chamado aberto", note: "Cliente relatou falha na partida.", type: "open" },
        { date: "2026-06-08 09:40", label: "Técnico designado", note: "João Mendes designado.", type: "assign" },
        { date: "2026-06-09 14:05", label: "Visita realizada", note: "Diagnóstico: bateria de partida degradada.", type: "visit" },
      ],
    },
    {
      os: "OS-2042", clientId: "C1", techId: "T4", equipId: "E1", priority: "alta", status: "aguardando",
      opened: "2026-06-07", sla: "2026-06-11", desc: "Ar-condicionado central sem refrigeração no bloco cirúrgico.",
      timeline: [
        { date: "2026-06-07 10:20", label: "Chamado aberto", note: "Falha de refrigeração reportada.", type: "open" },
        { date: "2026-06-07 11:00", label: "Técnico designado", note: "Beatriz Lima designada.", type: "assign" },
        { date: "2026-06-08 09:15", label: "Visita realizada", note: "Compressor com vazamento de gás.", type: "visit" },
        { date: "2026-06-08 16:30", label: "Aguardando peça", note: "Compressor solicitado ao fornecedor.", type: "wait" },
      ],
    },
    {
      os: "OS-2043", clientId: "C6", techId: "T2", equipId: "E5", priority: "alta", status: "aberta",
      opened: "2026-06-09", sla: "2026-06-12", desc: "Climatização do data center oscilando temperatura.",
      timeline: [
        { date: "2026-06-09 07:45", label: "Chamado aberto", note: "Alerta de temperatura no rack 4.", type: "open" },
      ],
    },
    {
      os: "OS-2044", clientId: "C2", techId: "T3", equipId: "E4", priority: "media", status: "andamento",
      opened: "2026-06-08", sla: "2026-06-13", desc: "Impressora de etiquetas com falha de calibração.",
      timeline: [
        { date: "2026-06-08 13:10", label: "Chamado aberto", note: "Etiquetas saindo desalinhadas.", type: "open" },
        { date: "2026-06-08 15:25", label: "Técnico designado", note: "Rafael Souza designado.", type: "assign" },
      ],
    },
    {
      os: "OS-2045", clientId: "C5", techId: "T1", equipId: "E6", priority: "media", status: "concluida",
      opened: "2026-06-04", sla: "2026-06-07", desc: "Manutenção preventiva do gerador de emergência.",
      timeline: [
        { date: "2026-06-04 09:00", label: "Chamado aberto", note: "Preventiva programada.", type: "open" },
        { date: "2026-06-04 10:30", label: "Técnico designado", note: "João Mendes designado.", type: "assign" },
        { date: "2026-06-05 11:00", label: "Visita realizada", note: "Troca de filtros e óleo.", type: "visit" },
        { date: "2026-06-05 15:40", label: "Equipamento reparado", note: "Testes de carga aprovados.", type: "fix" },
        { date: "2026-06-05 16:10", label: "Ordem encerrada", note: "Cliente assinou o relatório.", type: "close" },
      ],
    },
    {
      os: "OS-2046", clientId: "C4", techId: "T5", equipId: "E3", priority: "baixa", status: "concluida",
      opened: "2026-05-28", sla: "2026-06-02", desc: "Computador da secretaria não liga.",
      timeline: [
        { date: "2026-05-28 14:00", label: "Chamado aberto", note: "Equipamento sem energia.", type: "open" },
        { date: "2026-05-29 09:20", label: "Técnico designado", note: "Diego Farias designado.", type: "assign" },
        { date: "2026-05-30 10:45", label: "Visita realizada", note: "Fonte queimada identificada.", type: "visit" },
        { date: "2026-05-30 13:30", label: "Equipamento reparado", note: "Fonte substituída.", type: "fix" },
        { date: "2026-05-30 14:00", label: "Ordem encerrada", note: "Encerrada com sucesso.", type: "close" },
      ],
    },
    {
      os: "OS-2047", clientId: "C7", techId: "T2", equipId: "E7", priority: "baixa", status: "aberta",
      opened: "2026-06-09", sla: "2026-06-14", desc: "Computador do check-in travando com frequência.",
      timeline: [
        { date: "2026-06-09 11:30", label: "Chamado aberto", note: "Lentidão reportada pela recepção.", type: "open" },
      ],
    },
    {
      os: "OS-2048", clientId: "C8", techId: "T4", equipId: "E8", priority: "alta", status: "andamento",
      opened: "2026-06-08", sla: "2026-06-10", desc: "Impressora de preços parou de imprimir no setor de hortifruti.",
      timeline: [
        { date: "2026-06-08 08:50", label: "Chamado aberto", note: "Sem impressão.", type: "open" },
        { date: "2026-06-08 10:10", label: "Técnico designado", note: "Beatriz Lima designada.", type: "assign" },
        { date: "2026-06-09 09:00", label: "Visita realizada", note: "Cabeça de impressão obstruída.", type: "visit" },
      ],
    },
  ];

  // ---- Atendimentos por semana (gráfico) --------------------------------
  const weekly = [
    { day: "Seg", value: 18 },
    { day: "Ter", value: 24 },
    { day: "Qua", value: 21 },
    { day: "Qui", value: 29 },
    { day: "Sex", value: 33 },
    { day: "Sáb", value: 15 },
    { day: "Dom", value: 6 },
  ];

  // ---- Agenda técnica ---------------------------------------------------
  const schedule = [
    { date: "2026-06-09", time: "08:30", techId: "T1", clientId: "C3", equipId: "E2", os: "OS-2041" },
    { date: "2026-06-09", time: "10:00", techId: "T2", clientId: "C6", equipId: "E5", os: "OS-2043" },
    { date: "2026-06-09", time: "14:00", techId: "T4", clientId: "C8", equipId: "E8", os: "OS-2048" },
    { date: "2026-06-10", time: "09:00", techId: "T1", clientId: "C3", equipId: "E2", os: "OS-2041" },
    { date: "2026-06-10", time: "11:30", techId: "T3", clientId: "C2", equipId: "E4", os: "OS-2044" },
    { date: "2026-06-10", time: "15:00", techId: "T4", clientId: "C1", equipId: "E1", os: "OS-2042" },
    { date: "2026-06-11", time: "08:00", techId: "T2", clientId: "C7", equipId: "E7", os: "OS-2047" },
    { date: "2026-06-11", time: "13:00", techId: "T5", clientId: "C4", equipId: "E3", os: "OS-2046" },
  ];

  // ---- Atividades recentes ---------------------------------------------
  const activity = [
    { time: "há 12 min", text: "Beatriz Lima registrou visita na OS-2048", type: "visit" },
    { time: "há 38 min", text: "Nova OS-2043 aberta por Data Center NorteCloud", type: "open" },
    { time: "há 1 h",    text: "OS-2042 aguardando peça (compressor)", type: "wait" },
    { time: "há 2 h",    text: "João Mendes designado para OS-2041", type: "assign" },
    { time: "há 4 h",    text: "OS-2045 encerrada — preventiva concluída", type: "close" },
    { time: "ontem",     text: "OS-2046 encerrada no Colégio Horizonte", type: "close" },
  ];

  // ---- "Hoje" do sistema (data de referência da demonstração) -----------
  const TODAY = "2026-06-09";
  const addDays = (iso, n) => {
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  // ---- Métricas derivadas (recalculadas a cada chamada) -----------------
  function metrics() {
    const countBy = (st) => orders.filter((o) => o.status === st).length;
    return {
      open: countBy("aberta"),
      inProgress: countBy("andamento"),
      waiting: countBy("aguardando"),
      done: countBy("concluida"),
      techsInField: technicians.filter((t) => t.field).length,
      slaAvg: 94, // %
      today: schedule.filter((s) => s.date === TODAY).length,
      avgTime: technicians.reduce((a, t) => a + t.avgTime, 0) / technicians.length,
      firstFix: Math.round((technicians.reduce((a, t) => a + t.firstFix, 0) / technicians.length) * 100),
      topTech: [...technicians].sort((a, b) => b.jobs - a.jobs)[0],
      worstEquip: [...equipment].sort((a, b) => b.failures - a.failures)[0],
    };
  }

  // ---- Criação de uma nova OS (estado em memória do front) --------------
  function nextOsId() {
    const max = orders.reduce((m, o) => {
      const n = parseInt(String(o.os).replace(/\D/g, ""), 10);
      return n > m ? n : m;
    }, 0);
    return "OS-" + (max + 1);
  }

  function createOrder({ clientId, equipId, techId, priority, desc }) {
    const os = nextOsId();
    const now = TODAY + " " + new Date().toTimeString().slice(0, 5);
    const order = {
      os, clientId, equipId, techId,
      priority: priority || "media",
      status: "aberta",
      opened: TODAY,
      sla: addDays(TODAY, 3),
      desc: desc || "Chamado registrado via ServiceCore.",
      timeline: [
        { date: now, label: "Chamado aberto", note: "OS registrada no sistema.", type: "open" },
      ],
    };
    orders.unshift(order); // entra no topo da lista

    // reflete na agenda e no feed de atividades
    const c = clientById(clientId);
    schedule.push({ date: TODAY, time: "16:00", techId, clientId, equipId, os });
    activity.unshift({ time: "agora", text: `Nova ${os} aberta por ${c ? c.name : "cliente"}`, type: "open" });
    return order;
  }

  return {
    TODAY,
    technicians, techById,
    clients, clientById,
    equipment, equipById,
    orders, weekly, schedule, activity,
    metrics, nextOsId, createOrder,
  };
})();
