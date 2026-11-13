let mtInitialized = false;
let mtCharts = {};
let mtPeriod = 'month';
const mtEl = id => document.getElementById(id);
function mtIso(d) {
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}
function mtSetPeriod(period) {
    mtPeriod = period;
    const now = new Date();
    let from = new Date(now.getFullYear(), now.getMonth(), 1), to = now;
    if (period === 'previous') {
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        to = new Date(now.getFullYear(), now.getMonth(), 0)
    } else if (period === '7' || period === '90') {
        from = new Date(now);
        from.setDate(from.getDate() - (Number(period) - 1))
    }
    mtEl('mtFrom').value = mtIso(from);
    mtEl('mtTo').value = mtIso(to);
    document.querySelectorAll('.mt-periods button').forEach(b => b.classList.toggle('selected', b.dataset.days === period));
}
function mtDuration(seconds) {
    if (seconds === null || seconds === undefined)
        return 'Sin datos';
    seconds = Math.round(seconds);
    return seconds < 60 ? seconds + 's' : Math.floor(seconds / 60) + 'm ' + String(seconds % 60).padStart(2, '0') + 's'
}
function mtBar(target, rows) {
    const root = mtEl(target);
    root.replaceChildren();
    if (!rows.length) {
        root.textContent = 'Sin datos para el período';
        return
    }
    const total = rows.reduce((s, r) => s + Number(r.count), 0);
    rows.forEach(r => {
        const pct = total ? 100 * r.count / total : 0;
        const box = document.createElement('div');
        box.className = 'mt-bar-row';
        const label = document.createElement('div');
        label.className = 'mt-bar-head';
        const name = document.createElement('span');
        name.textContent = r.label;
        const count = document.createElement('b');
        count.textContent = r.count + ' · ' + pct.toFixed(0) + '%';
        label.append(name, count);
        const track = document.createElement('div');
        track.className = 'mt-bar-track';
        const fill = document.createElement('div');
        fill.className = 'mt-bar-fill';
        fill.style.width = pct + '%';
        track.append(fill);
        box.append(label, track);
        root.append(box)
    })
}
function mtDraw(id, type, labels, data, color, fill = false) {
    if (!window.Chart || !mtEl(id)) return;
    mtCharts[id]?.destroy();
    const spark = id.startsWith('mtSpark');
    const ctx = mtEl(id).getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, spark ? 75 : 270);
    gradient.addColorStop(0, 'rgba(118,49,154,.32)');
    gradient.addColorStop(1, 'rgba(118,49,154,0)');
    const dataset = {
        data, borderColor: color,
        backgroundColor: type === 'bar' ? color : (fill ? gradient : 'transparent'),
        fill: type === 'line' && fill,
        tension: .42, cubicInterpolationMode: 'monotone',
        pointRadius: spark ? 0 : (labels.length > 45 ? 0 : 2),
        pointHoverRadius: 5, pointHitRadius: 12,
        pointBackgroundColor: color, borderWidth: spark ? 2 : 2.3,
        borderCapStyle: 'round', borderJoinStyle: 'round',
        ...(type === 'bar' ? {borderRadius: 3, maxBarThickness: 30, categoryPercentage: .86, barPercentage: .82} : {})
    };
    mtCharts[id] = new Chart(ctx, {
        type, data: {labels, datasets: [dataset]},
        options: {
            responsive: true, maintainAspectRatio: false, animation: {duration: 420},
            interaction: {mode: 'index', intersect: false},
            layout: {padding: spark ? 0 : {top: 5, right: 6, left: 0, bottom: 0}},
            plugins: {
                legend: {display: false},
                tooltip: {enabled: !spark, backgroundColor: '#292438', padding: 11,
                    displayColors: false, cornerRadius: 8,
                    callbacks: {label: item => item.parsed.y + ' conversaciones'}}
            },
            scales: spark ? {x: {display: false}, y: {display: false}} : {
                x: {grid: {display: false}, border: {display: false},
                    ticks: {color: '#817b8e', maxRotation: 0, autoSkip: true, maxTicksLimit: 12, font: {size: 11}}},
                y: {beginAtZero: true, border: {display: false, dash: [3, 4]},
                    grid: {color: '#e7e3ee', drawTicks: false},
                    ticks: {precision: 0, color: '#817b8e', padding: 12, font: {size: 11}}}
            }
        }
    });
}
let mtRequestSequence = 0;
function mtDays(from, to) {
    const result = [];
    const current = new Date(from + 'T12:00:00');
    const end = new Date(to + 'T12:00:00');
    for (let i = 0; current <= end && i < 367; i++, current.setDate(current.getDate() + 1)) result.push(mtIso(current));
    return result;
}
async function mtLoad() {
    const err = mtEl('mtError');
    err.hidden = true;
    const from = mtEl('mtFrom').value, to = mtEl('mtTo').value;
    if (!from || !to || from > to) {
        err.textContent = 'Revisá las fechas seleccionadas';
        err.hidden = false;
        return
    }
    const sequence = ++mtRequestSequence;
    try {
        const res = await fetch(contextPath + '/ProcesoDatosChat', {method: 'POST', credentials: 'same-origin', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({Accion: 'GetConversationAnalytics', Parametro1: from, Parametro2: to, Parametro3: mtEl('mtChannel').value})});
        if (!res.ok)
            throw Error('La API respondió HTTP ' + res.status);
        const d = await res.json();
        if (sequence !== mtRequestSequence) return;
        mtEl('mtTotal').textContent = Number(d.total).toLocaleString('es-AR');
        mtEl('mtAiTime').textContent = mtDuration(d.aiFirstResponseSeconds);
        mtEl('mtHumanTime').textContent = mtDuration(d.humanFirstResponseSeconds);
        mtEl('mtPending').textContent = d.pending;
        mtEl('mtProjected').textContent = d.projected === null ? '—' : Number(d.projected).toLocaleString('es-AR');
        mtEl('mtProjectedNote').textContent = d.projected === null ? 'Proyección disponible solo para el mes actual' : 'Proyección al cierre del mes';
        mtBar('mtModes', d.modes);
        mtBar('mtChannels', d.channels);
        const sel = mtEl('mtChannel'), selected = sel.value;
        sel.replaceChildren(new Option('Todos los canales', ''));
        (d.availableChannels || []).forEach(c => sel.add(new Option(c.name, c.code)));
        sel.value = selected;
        const days = mtDays(from, to);
        const dailyCounts = new Map((d.daily || []).map(x => [x.date, Number(x.count)]));
        const dayValues = days.map(day => dailyCounts.get(day) ?? 0);
        const hours = Array.from({length: 24}, (_, h) => h);
        const hourCounts = new Map((d.hourly || []).map(x => [Number(x.hour), Number(x.count)]));
        mtDraw('mtDaily', 'line', days.map(x => x.slice(8,10) + '/' + x.slice(5,7)), dayValues, '#76319a', true);
        mtDraw('mtHourly', 'bar', hours.map(h => String(h).padStart(2, '0') + 'h'), hours.map(h => hourCounts.get(h) ?? 0), '#76319a');
        mtDraw('mtSparkTotal', 'line', days, dayValues, '#f2777f');
        // No graficar series IA/Humano sin datos diarios reales del backend.
        ['mtSparkAi', 'mtSparkHuman'].forEach(id => {mtCharts[id]?.destroy(); mtCharts[id] = null;});
        // Las métricas de fallback/agente requieren nuevos eventos y consultas SQL.
        // Se mantienen como Sin datos hasta que la API las exponga.
    } catch (e) {
        if (sequence !== mtRequestSequence) return;
        err.textContent = 'No se pudieron cargar las métricas: ' + e.message;
        err.hidden = false;
        console.error(e)
    }
}
async function initMetrics() {
    if (!mtInitialized) {
        mtInitialized = true;
        mtSetPeriod('month');
        document.querySelectorAll('.mt-periods button').forEach(b => b.addEventListener('click', () => {
                mtSetPeriod(b.dataset.days);
                mtLoad()
            }));
        mtEl('mtApply').addEventListener('click', () => {
            document.querySelectorAll('.mt-periods button').forEach(b => b.classList.remove('selected'));
            mtLoad()
        });
        mtEl('mtChannel').addEventListener('change', mtLoad)
    }
    await mtLoad()
}
