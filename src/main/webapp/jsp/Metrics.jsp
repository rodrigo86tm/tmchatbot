<section class="mt-page" id="mtDashboard">
  <header class="mt-head">
    <div><h1>Analíticas de Conversaciones</h1><p>Monitoreá y analizá tus conversaciones con clientes</p><span class="mt-note"><i class="bi bi-info-circle"></i> Datos de PostgreSQL · Actualización al cambiar filtros</span></div>
    <div class="mt-filters"><select id="mtChannel" aria-label="Canal"><option value="">Todos los canales</option></select><div class="mt-periods"><button type="button" data-days="7">Esta semana</button><button type="button" data-days="month" class="selected">Este mes</button><button type="button" data-days="previous">Mes anterior</button><button type="button" data-days="90">Últimos 90 días</button></div><div class="mt-dates"><label>Desde <input type="date" id="mtFrom"></label><label>Hasta <input type="date" id="mtTo"></label><button type="button" id="mtApply">Aplicar</button></div></div>
  </header>
  <div class="mt-tabs"><button class="active" type="button">Resumen</button></div>
  <div id="mtError" class="mt-error" hidden></div>
  <div class="mt-cards">
    <article class="mt-card"><div class="mt-card-label"><i class="bi bi-chat-left-text"></i> Conversaciones totales</div><strong id="mtTotal">?</strong><small>Iniciadas en el período</small><div class="mt-spark"><canvas id="mtSparkTotal"></canvas></div></article>
    <article class="mt-card"><div class="mt-card-label"><i class="bi bi-calendar3"></i> Conversaciones proyectadas</div><strong id="mtProjected">?</strong><small id="mtProjectedNote">Proyección para este mes</small></article>
    <article class="mt-card"><div class="mt-card-label"><i class="bi bi-lightning-charge"></i> Primera respuesta IA</div><strong id="mtAiTime">?</strong><small>Promedio de primera respuesta por conversación</small><div class="mt-spark"><canvas id="mtSparkAi"></canvas></div></article>
    <article class="mt-card"><div class="mt-card-label"><i class="bi bi-person"></i> Primera respuesta humana</div><strong id="mtHumanTime">?</strong><small>Promedio de primera respuesta por conversación</small><div class="mt-spark"><canvas id="mtSparkHuman"></canvas></div></article>
  </div>
  <div class="mt-extra-cards">
    <article class="mt-card mt-card-compact"><div class="mt-card-label"><i class="bi bi-person-check"></i> Primera respuesta tras fallback</div><strong id="mtFallbackResponse">Sin datos</strong><small>Requiere eventos de derivación a humano</small></article>
    <article class="mt-card mt-card-compact"><div class="mt-card-label"><i class="bi bi-stopwatch"></i> Ciclo tras fallback</div><strong id="mtFallbackCycle">Sin datos</strong><small>Requiere fechas de derivación y cierre</small></article>
    <article class="mt-card mt-card-compact"><div class="mt-card-label"><i class="bi bi-headset"></i> Tiempo con agente</div><strong id="mtAgentTime">Sin datos</strong><small>Requiere historial de asignaciones</small></article>
  </div>
  <div class="mt-distributions">
    <article class="mt-panel"><h3>Distribución de conversaciones</h3><div id="mtModes"></div></article>
    <article class="mt-panel"><h3>Distribución por canal</h3><div id="mtChannels"></div></article>
    <article class="mt-panel"><h3>Conversaciones pendientes</h3><strong class="mt-highlight" id="mtPending">?</strong><p>Último mensaje del cliente sin respuesta posterior. No equivale necesariamente a un fallback.</p></article>
  </div>
  <article class="mt-panel mt-chart-panel"><div class="mt-chart-heading"><div><h3>Conversaciones por hora del día</h3><p>Horario de Argentina · Corresponde al período seleccionado</p></div></div><div class="mt-chart"><canvas id="mtHourly"></canvas></div></article>
  <article class="mt-panel mt-chart-panel"><div class="mt-chart-heading"><div><h3>Evolución de conversaciones</h3><p>Conversaciones iniciadas por día</p></div></div><div class="mt-chart"><canvas id="mtDaily"></canvas></div></article>
</section>
