/* Cargar DESPUÉS de prompt.js. API autenticada por Servlet. */
const promptAdminApi = async (method, path, body) => {
    const r = await fetch(contextPath + '/PromptAdminProxy' + path, {method, credentials: 'include', headers: {'Content-Type': 'application/json'}, body: body === undefined ? undefined : JSON.stringify(body)});
    if (!r.ok)
        throw new Error((await r.text()).slice(0, 300) || `HTTP ${r.status}`);
    return r.json();
};
function promptAdminEditor(title, values, onSave) {
    const overlay = document.createElement('div');
    overlay.className = 'pa-overlay';
    overlay.innerHTML = `<div class="pa-dialog" role="dialog" aria-modal="true"><h3></h3><label>Título<input class="pa-title" maxlength="200"></label><label>Contenido<textarea class="pa-content" rows="8"></textarea></label><div class="pa-buttons"><button type="button" class="pa-cancel">Cancelar</button><button type="button" class="pa-save">Guardar</button></div></div>`;
    overlay.querySelector('h3').textContent = title;
    overlay.querySelector('.pa-title').value = values.Titulo || '';
    overlay.querySelector('.pa-content').value = values.Contenido || '';
    overlay.querySelector('.pa-cancel').onclick = () => overlay.remove();
    overlay.querySelector('.pa-save').onclick = async() => {
        const btn = overlay.querySelector('.pa-save');
        btn.disabled = true;
        try {
            await onSave({Titulo: overlay.querySelector('.pa-title').value, Contenido: overlay.querySelector('.pa-content').value});
            overlay.remove();
            await getPrompt(currentPrompt.Id);
        } catch (e) {
            alert(e.message);
        } finally {
            btn.disabled = false;
        }
    };
    document.body.appendChild(overlay);
}
// Las funciones siguientes sustituyen los placeholders de prompt.js.
window.editPromptRule = function (id) {
    const rule = findRule(id);
    if (!rule)
        return;
    promptAdminEditor('Editar regla', rule, async v => promptAdminApi('PUT', `/rules/${id}`, {...v, Tipo: rule.Tipo || 'RULE', Activo: rule.Activo}));
};
window.deletePromptRule = async function (id) {
    const rule = findRule(id);
    if (!rule)
        return;
    if (!confirm(`¿Seguro que querés desactivar la regla «${rule.Titulo || 'Regla'}»?`))
        return;
    try {
        await promptAdminApi('DELETE', `/rules/${id}`);
        await getPrompt(currentPrompt.Id);
    } catch (e) {
        alert(e.message);
    }
};
window.addPromptRule = function (sectionId) {
    promptAdminEditor('Agregar regla', {Titulo: '', Contenido: ''}, async v => promptAdminApi('POST', `/sections/${sectionId}/rules`, {...v, Tipo: 'RULE', Activo: true}));
};
window.changeSectionStatus = async function (sectionId, activo) {
    try {
        await promptAdminApi('PUT', `/sections/${sectionId}/status`, activo);
    } catch (e) {
        alert(e.message);
        await getPrompt(currentPrompt.Id);
    }
};
window.showTemporaryRules = async function () {
    if (!currentPrompt)
        await getPrompt(1);
    const promptId = currentPrompt?.Id || 1;
    const rows = await promptAdminApi('GET', `/temporary/${promptId}`);
    const host = document.getElementById('promptSections');
    const container = document.createElement('div');
    container.className = 'pa-page';
    const header = document.createElement('div');
    header.className = 'pa-page-header';
    const titleBox = document.createElement('div');
    const heading = document.createElement('h2');
    heading.textContent = 'Reglas temporales';
    titleBox.appendChild(heading);
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Promociones y excepciones comerciales con vigencia y prioridad sobre reglas habituales.';
    titleBox.appendChild(subtitle);
    const add = document.createElement('button');
    add.className = 'pa-primary';
    add.type = 'button';
    add.innerHTML = '<i class="bi bi-plus-lg"></i> Agregar regla temporal';
    header.append(titleBox, add);
    container.appendChild(header);
    const counter = document.createElement('div');
    counter.className = 'pa-count';
    counter.textContent = `${rows.filter(x => x.Activo).length} reglas activas · ${rows.length} en total`;
    container.appendChild(counter);
    if (!rows.length) {
        const empty = document.createElement('div');
        empty.className = 'pa-empty';
        empty.innerHTML = '<i class="bi bi-clock-history"></i><strong>Todavía no hay reglas temporales</strong><span>Agregá una promoción o excepción para que tenga prioridad durante su vigencia.</span>';
        container.appendChild(empty);
    }
    host.replaceChildren(container);
    add.onclick = () => temporaryEditor(promptId, null);
    rows.forEach(row => {
        const card = document.createElement('div');
        card.className = 'pa-temp-card';
        const name = document.createElement('strong');
        name.textContent = row.Titulo;
        card.appendChild(name);
        const badge = document.createElement('span');
        badge.className = 'pa-status ' + (row.Activo ? 'is-active' : '');
        badge.textContent = row.Activo ? 'Activa' : 'Inactiva';
        card.appendChild(badge);
        const detail = document.createElement('p');
        detail.textContent = row.Contenido;
        card.appendChild(detail);
        const dates = document.createElement('small');
        dates.textContent = `Desde ${row.FechaInicio} hasta ${row.FechaFin || 'sin vencimiento'}`;
        card.appendChild(dates);
        const edit = document.createElement('button');
        edit.className = 'pa-secondary';
        edit.textContent = 'Editar';
        edit.onclick = () => temporaryEditor(promptId, row);
        card.appendChild(edit);
        const del = document.createElement('button');
        del.className = 'pa-secondary';
        del.textContent = 'Desactivar';
        del.onclick = async() => {
            if (confirm('¿Desactivar esta regla temporal?')) {
                await promptAdminApi('DELETE', `/temporary/${row.Id}`);
                await showTemporaryRules();
            }
        };
        card.appendChild(del);
        container.appendChild(card);
    });
};
function temporaryEditor(promptId, row) {
    const overlay = document.createElement('div');
    overlay.className = 'pa-overlay';
    overlay.innerHTML = `<div class="pa-dialog"><h3>Regla temporal</h3><label>Título<input class="t-title"></label><label>Contenido<textarea class="t-content" rows="6"></textarea></label><label>Reemplazar regla estándar (ID, opcional)<input class="t-standard" type="number"></label><label>Inicio (hora local Argentina)<input class="t-start" type="datetime-local"></label><label>Fin (opcional)<input class="t-end" type="datetime-local"></label><label>Prioridad<input class="t-priority" type="number"></label><label><input class="t-active" type="checkbox"> Activa</label><div class="pa-buttons"><button class="t-cancel">Cancelar</button><button class="t-save">Guardar</button></div></div>`;
    const q = s => overlay.querySelector(s);
    q('.t-title').value = row?.Titulo || '';
    q('.t-content').value = row?.Contenido || '';
    q('.t-standard').value = row?.StandardRuleId || '';
    const toLocal = s => {
        if (!s)
            return '';
        const d = new Date(s.endsWith('Z') ? s : s + 'Z');
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };
    q('.t-start').value = toLocal(row?.FechaInicio) || new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    q('.t-end').value = toLocal(row?.FechaFin);
    q('.t-priority').value = row?.Prioridad??100;
    q('.t-active').checked = row?.Activo??true;
    q('.t-cancel').onclick = () => overlay.remove();
    q('.t-save').onclick = async() => {
        const body = {PromptId: promptId, StandardRuleId: q('.t-standard').value ? Number(q('.t-standard').value) : null, Titulo: q('.t-title').value, Contenido: q('.t-content').value, FechaInicio: new Date(q('.t-start').value).toISOString(), FechaFin: q('.t-end').value ? new Date(q('.t-end').value).toISOString() : null, Prioridad: Number(q('.t-priority').value), Activo: q('.t-active').checked};
        try {
            await promptAdminApi(row ? 'PUT' : 'POST', row ? `/temporary/${row.Id}` : '/temporary', body);
            overlay.remove();
            await showTemporaryRules();
        } catch (e) {
            alert(e.message);
        }
    };
    document.body.appendChild(overlay);
}
window.showGlobalSettings = async function () {
    if (!currentPrompt)
        await getPrompt(1);
    const promptId = currentPrompt?.Id || 1;
    const s = await promptAdminApi('GET', `/settings/${promptId}`);
    const container = document.getElementById('promptSections');
    container.innerHTML = `<div class="pa-page"><div class="pa-page-header"><div><h2>Configuración global</h2><p>Definí cómo debe comportarse el asistente fuera del horario comercial.</p></div></div><div class="pa-settings"><h3>Atención y disponibilidad</h3><label>Zona horaria Windows<input class="pa-tz"></label><label><input type="checkbox" class="pa-enabled"> Habilitar restricción horaria</label><label>Fuera de horario<select class="pa-mode"><option value="AUTO">Aviso automático</option><option value="SILENT">Sin respuesta</option><option value="QUEUE">Pendiente</option></select></label><label>Mensaje de cierre<textarea class="pa-msg" rows="5"></textarea></label><button class="pa-save-settings">Guardar configuración</button><p class="pa-warning"><strong>Atención:</strong> no habilites el control hasta integrar el bloqueo en los workers y la agenda semanal.</p></div></div>`;
    const q = x => container.querySelector(x);
    q('.pa-tz').value = s.TimeZoneId;
    q('.pa-enabled').checked = s.ScheduleEnabled;
    q('.pa-mode').value = s.ClosedMode;
    q('.pa-msg').value = s.ClosedMessage;
    q('.pa-save-settings').onclick = async() => {
        try {
            await promptAdminApi('PUT', `/settings/${promptId}`, {TimeZoneId: q('.pa-tz').value, ScheduleEnabled: q('.pa-enabled').checked, ClosedMode: q('.pa-mode').value, ClosedMessage: q('.pa-msg').value});
            alert('Configuración guardada');
        } catch (e) {
            alert(e.message);
        }
    };
};
