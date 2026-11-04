let currentPrompt = null;

async function getPrompt(promptId) {

    const container =
        document.getElementById('promptSections');

    try {

        showPromptLoading();

        const payload = {
            Controller: "GET",
            Tabla: "Logistica",
            Accion: "GetPromptPage",
            Parametro1: String(promptId)
        };

        const response = await fetch(
            contextPath + '/ProcesoDatos',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error(
                `Error HTTP ${response.status}`
            );
        }

        const result = await response.json();

        if (!result || !result.Id) {
            throw new Error(
                'La API no devolvió un prompt válido'
            );
        }

        currentPrompt = result;

        loadPrompt(currentPrompt);
        return true;

    }
    catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="prompt-error">
                <i class="bi bi-exclamation-triangle"></i>

                <div>
                    <strong>No se pudo cargar el prompt</strong>
                    <p>${escapeHtml(error.message)}</p>
                </div>
            </div>
        `;
    }
}
function loadPrompt(prompt) {

    console.log("ENTRÓ A loadPrompt");
    console.log("PROMPT:", prompt);
    console.log("SECTIONS:", prompt?.Sections);

    const container =
        document.getElementById('promptSections');

    console.log("CONTAINER:", container);

    container.innerHTML = '';

    if (!prompt ||
        !prompt.Sections ||
        prompt.Sections.length === 0) {

        console.log("NO HAY SECCIONES");

        container.innerHTML = `
            <div class="empty-sections">
                No hay secciones configuradas.
            </div>
        `;

        return;
    }

    const sections = [...prompt.Sections]
        .sort((a, b) => a.Orden - b.Orden);

    console.log("CANTIDAD SECCIONES:", sections.length);

    sections.forEach(section => {

        console.log("CREANDO SECTION:", section);

        const card =
            createPromptSectionCard(section);

        console.log("CARD CREADO:", card);

        container.appendChild(card);
    });

    console.log("HTML FINAL:", container.innerHTML);
}
function createPromptSectionCard(section) {

    const article =
        document.createElement('article');

    article.className = 'prompt-card';

    article.id =
        `prompt-section-${section.Id}`;

    article.dataset.sectionId =
        section.Id;

    article.dataset.order =
        section.Orden;

    article.dataset.active =
        section.Activo;

    const icon =
        getSectionIcon(section.Nombre);

    const cantidad =
        section.Rules?.length ?? 0;

    article.innerHTML = `
        <div class="prompt-card-header"
             data-section-id="${section.Id}">

            <div class="section-card-icon">
                <i class="bi ${icon}"></i>
            </div>

            <div class="section-card-info">

                <div class="section-card-title">
                    ${escapeHtml(section.Nombre)}
                </div>

                <div class="section-card-description">
                    ${escapeHtml(section.Descripcion || '')}
                </div>

            </div>

            <div class="section-card-actions">

                <span class="rule-badge"
                      id="rule-count-${section.Id}">

                    ${cantidad}
                    ${cantidad === 1 ? 'regla' : 'reglas'}

                </span>

                <label class="switch"
                       title="Activar/desactivar sección">

                    <input
                        type="checkbox"
                        class="section-active"
                        data-section-id="${section.Id}"
                        ${section.Activo ? 'checked' : ''}>

                    <span class="slider"></span>

                </label>

                <button
                    class="expand-btn"
                    type="button"
                    data-section-id="${section.Id}"
                    aria-expanded="false">

                    <i class="bi bi-chevron-down"></i>

                </button>

            </div>

        </div>

        <div class="prompt-card-content"
             id="section-content-${section.Id}">

            <div class="rules-container"
                 id="rules-${section.Id}">
            </div>

            <button
                class="add-rule"
                type="button"
                data-section-id="${section.Id}">

                <i class="bi bi-plus"></i>
                Agregar regla

            </button>

        </div>
    `;

    const rulesContainer =
        article.querySelector('.rules-container');

    const rules =
        [...(section.Rules || [])]
            .sort((a, b) => a.Orden - b.Orden);

    rules.forEach(rule => {

        rulesContainer.appendChild(
            createPromptRule(
                rule,
                section.Id
            )
        );
    });

    return article;
}
function createPromptRule(rule, sectionId) {

    const div =
        document.createElement('div');

    div.className =
        'rule prompt-rule';

    if (!rule.Activo) {
        div.classList.add(
            'rule-disabled'
        );
    }

    div.id =
        `prompt-rule-${rule.Id}`;

    div.dataset.ruleId =
        rule.Id;

    div.dataset.sectionId =
        sectionId;

    div.dataset.order =
        rule.Orden;

    div.dataset.type =
        rule.Tipo;

    div.innerHTML = `

        <div class="rule-header">

            <div class="rule-title">

                <span class="rule-type">
                    ${escapeHtml(rule.Tipo)}
                </span>

                <strong>
                    ${escapeHtml(
                        rule.Titulo || 'Regla'
                    )}
                </strong>

            </div>

            <div class="rule-actions">

                <button
                    type="button"
                    class="rule-edit"
                    data-rule-id="${rule.Id}"
                    title="Editar">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    type="button"
                    class="rule-delete"
                    data-rule-id="${rule.Id}"
                    title="Eliminar">

                    <i class="bi bi-trash"></i>

                </button>

            </div>

        </div>

        <div class="rule-content">
            ${formatRuleContent(
                rule.Contenido
            )}
        </div>
    `;

    return div;
}
function formatRuleContent(text) {

    if (!text)
        return '';

    return escapeHtml(text)
        .replace(/\n/g, '<br>');
}
function escapeHtml(value) {

    if (value === null || value === undefined)
        return '';

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function getSectionIcon(name) {

    const value =
        (name || '').toLowerCase();

    if (value.includes('identidad'))
        return 'bi-robot';

    if (value.includes('saludo'))
        return 'bi-stars';

    if (value.includes('contexto'))
        return 'bi-shop';

    if (value.includes('horario'))
        return 'bi-clock';

    if (value.includes('tono'))
        return 'bi-stars';

    if (value.includes('restric'))
        return 'bi-shield-lock';

    if (value.includes('deriv'))
        return 'bi-headset';

    return 'bi-list-task';
}
document
    .getElementById('promptSections')
    .addEventListener('click', function(e) {

        const expandButton =
            e.target.closest('.expand-btn');

        if (expandButton) {

            togglePromptSection(expandButton);

            return;
        }

        const editButton =
            e.target.closest('.rule-edit');

        if (editButton) {

            const ruleId =
                Number(editButton.dataset.ruleId);

            editPromptRule(ruleId);

            return;
        }

        const deleteButton =
            e.target.closest('.rule-delete');

        if (deleteButton) {

            const ruleId =
                Number(deleteButton.dataset.ruleId);

            deletePromptRule(ruleId);

            return;
        }

        const addButton =
            e.target.closest('.add-rule');

        if (addButton) {

            const sectionId =
                Number(addButton.dataset.sectionId);

            addPromptRule(sectionId);

            return;
        }
    });
    function togglePromptSection(button) {

    const sectionId =
        button.dataset.sectionId;

    const card =
        document.getElementById(
            `prompt-section-${sectionId}`
        );

    if (!card)
        return;

    const expanded =
        card.classList.toggle('open');

    button.setAttribute(
        'aria-expanded',
        expanded
    );

    const icon =
        button.querySelector('i');

    if (expanded) {

        icon.classList.remove(
            'bi-chevron-down'
        );

        icon.classList.add(
            'bi-chevron-up'
        );

    }
    else {

        icon.classList.remove(
            'bi-chevron-up'
        );

        icon.classList.add(
            'bi-chevron-down'
        );
    }
}
function findRule(ruleId) {

    if (!currentPrompt)
        return null;

    for (const section of currentPrompt.Sections) {

        const rule =
            section.Rules.find(
                x => x.Id === ruleId
            );

        if (rule)
            return rule;
    }

    return null;
}
function editPromptRule(ruleId) {

    const rule = findRule(ruleId);

    if (!rule)
        return;

    console.log('Editar:', rule);

    // Próximo paso:
    // abrir modal/editor.
}
document
    .getElementById('promptSections')
    .addEventListener('change', function(e) {

        if (
            e.target.classList.contains(
                'section-active'
            )
        ) {

            const sectionId =
                Number(e.target.dataset.sectionId);

            const activo =
                e.target.checked;

            changeSectionStatus(
                sectionId,
                activo
            );
        }
    });
document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(".expand-btn");

        if (!button)
            return;

        event.preventDefault();
        event.stopPropagation();

        const sectionId =
            button.dataset.sectionId;

        const card =
            document.getElementById(
                `prompt-section-${sectionId}`
            );

        if (!card)
            return;

        const expanded =
            card.classList.toggle("expanded");

        button.setAttribute(
            "aria-expanded",
            expanded
        );

        console.log(
            "Section:",
            sectionId,
            "expanded:",
            expanded
        );
    }
);
    
    function showPromptLoading() {

    const container =
        document.getElementById('promptSections');

    container.innerHTML = `
        <div class="prompt-loading">

            <div class="prompt-spinner"></div>

            <span>
                Cargando configuración...
            </span>

        </div>
    `;
}
let promptLoaded = false;

async function showChatbot() {

    if (promptLoaded)
        return;

    console.log("Cargando prompt...");

    const success =
        await getPrompt(1);

    if (success) {

        promptLoaded = true;

        console.log(
            "Prompt cargado correctamente"
        );
    }
}
