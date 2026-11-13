let lcConversations = [];
let lcCurrentConversation = null;
let lcCurrentOperatorId = null;
let lcMessages = [];
let lcActiveFilter = "ALL";

let lcSocket = null;
let lcSocketReconnectTimer = null;

let lcIsLoadingMessages = false;
let lcHasMoreMessages = true;
let lcOldestMessageId = null;

let lcLoaded = false;
let lcHeartbeat = null;
let lcHeartbeatTimer = null;
let lcSocketConnecting = false;

const LIVECHAT_CHANNELS = {
    WHATSAPP: {
        code: "WHATSAPP",
        promptId: 1,
        label: "Tío Musa WhatsApp IA"
    },
    MERCADO_LIBRE: {
        code: "MERCADO_LIBRE",
        promptId: 2,
        label: "Tío Musa ML IA"
    }
};
let lcCurrentChannel = "WHATSAPP";
async function sendLiveChatHeartbeat() {

    if (document.hidden)
        return;

    try {

        const response = await fetch(
                contextPath + "/ProcesoDatosChat",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Accion: "LiveChatHeartbeat"
                    })
                }
        );

        if (response.status === 401) {
            stopLiveChatHeartbeat();
            handleLiveChatUnauthorized();
            return;
        }

        if (!response.ok)
            throw new Error("Heartbeat rechazado.");

    } catch (error) {
        console.warn(
                "No se pudo actualizar la presencia:",
                error
                );
    }
}

function startLiveChatHeartbeat() {

    if (lcHeartbeatTimer !== null)
        return;

    sendLiveChatHeartbeat();

    lcHeartbeatTimer = setInterval(
            sendLiveChatHeartbeat,
            30000
            );
}

function stopLiveChatHeartbeat() {

    if (lcHeartbeatTimer !== null) {
        clearInterval(lcHeartbeatTimer);
        lcHeartbeatTimer = null;
    }
}
async function loadCurrentOperator() {

    const response = await fetch(
            contextPath + "/ProcesoDatosChat",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Accion: "GetCurrentLiveChatOperator"
                })
            }
    );

    if (response.status === 401) {
        handleLiveChatUnauthorized();
        return;
    }

    if (!response.ok)
        throw new Error("No se pudo obtener el operador.");

    const result = await response.json();

    lcCurrentOperatorId = Number(result.userId);
}
function initializeLiveChatFilters() {

    const filterRow =
            document.getElementById("lcFilterRow");

    if (!filterRow)
        return;

    if (filterRow.dataset.initialized === "true")
        return;

    filterRow.dataset.initialized = "true";

    filterRow.addEventListener("click", event => {

        const button = event.target.closest(
                "button[data-lc-filter]"
                );

        if (!button || !filterRow.contains(button))
            return;

        lcActiveFilter = button.dataset.lcFilter;

        updateLiveChatFilterButtons();
        renderConversationList();
    });

    updateLiveChatFilterButtons();
}

function updateLiveChatFilterButtons() {

    document.querySelectorAll(
            "#lcFilterRow [data-lc-filter]"
            ).forEach(button => {

        const active =
                button.dataset.lcFilter === lcActiveFilter;

        button.classList.toggle(
                "lc-filter-active",
                active
                );

        button.setAttribute(
                "aria-pressed",
                String(active)
                );
    });
}
function initializeChannelSelector() {

    const dropdown = document.getElementById("tmChannelDropdown");
    const trigger = document.getElementById("lcChannelSelector");

    if (!dropdown || !trigger)
        return;

    if (dropdown.dataset.initialized === "true")
        return;

    dropdown.dataset.initialized = "true";

    trigger.addEventListener("click", event => {
        event.stopPropagation();

        const isOpen = dropdown.classList.toggle("open");

        trigger.setAttribute("aria-expanded", String(isOpen));
    });

    dropdown.querySelectorAll(".tm-channel-option")
            .forEach(option => {

                option.addEventListener("click", async () => {

                    const channelCode = option.dataset.channel;

                    dropdown.classList.remove("open");
                    trigger.setAttribute("aria-expanded", "false");

                    await changeLiveChatChannel(channelCode);

                    dropdown.querySelectorAll(".tm-channel-option")
                            .forEach(item => {
                                item.classList.toggle(
                                        "active",
                                        item.dataset.channel === channelCode
                                        );
                            });
                });
            });

    document.addEventListener("click", event => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove("open");
            trigger.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            dropdown.classList.remove("open");
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus();
        }
    });
}
async function changeLiveChatChannel(channelCode) {
    const config = LIVECHAT_CHANNELS[channelCode];

    if (!config)
        return;

    lcCurrentChannel = channelCode;
    lcCurrentConversation = null;
    lcMessages = [];
    lcOldestMessageId = null;
    lcHasMoreMessages = true;

    document.getElementById("lcMessages")?.replaceChildren();

    const name = document.getElementById("lcContactName");
    const phone = document.getElementById("lcContactPhone");

    if (name)
        name.textContent = "Seleccioná una conversación";

    if (phone)
        phone.textContent = "";

    const selectorLabel = document.querySelector(
            "#lcChannelSelector .tm-channel-label"
            );

    if (selectorLabel) {
        selectorLabel.textContent =
                channelCode === "WHATSAPP"
                ? "Tío Musa WhatsApp IA"
                : "Tío Musa ML IA";
    }

    renderConversationList();
    updateAssignmentButton();
    updateChatInput();

    try {
        const results = await Promise.all([
            getPrompt(config.promptId),
            loadLiveChatConversations()
        ]);

        if (!results[0]) {
            console.warn("No se pudo cargar el prompt del canal.");
        }
    } catch (error) {
        console.error("Error cambiando el canal:", error);
    }
}
function initializeLiveChatComposer() {

    const input = document.getElementById("lcMessageInput");
    const button = document.getElementById("lcSendButton");

    if (!input || !button)
        return;

    if (input.dataset.initialized === "true")
        return;

    input.dataset.initialized = "true";

    button.addEventListener("click", sendLiveChatMessage);

    input.addEventListener("keydown", function (event) {

        if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.isComposing
                ) {
            event.preventDefault();
            sendLiveChatMessage();
        }
    });

    input.addEventListener("input", updateChatInput);

    updateChatInput();
}
function updateChatInput() {

    const input = document.getElementById("lcMessageInput");
    const button = document.getElementById("lcSendButton");

    if (!input || !button)
        return;

    const canWrite =
            lcCurrentConversation?.HandlingMode?.toUpperCase() === "HUMAN";

    input.disabled = !canWrite;

    button.disabled =
            !canWrite ||
            !input.value.trim() ||
            !lcSocket ||
            lcSocket.readyState !== WebSocket.OPEN;

    input.placeholder = canWrite
            ? "Escribí un mensaje..."
            : "Tomá la conversación para responder";
}
async function loadLiveChat() {

    if (lcLoaded) {
        return;
    }
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            sendLiveChatHeartbeat();
        }
    });
    try {

        //showLiveChatLoading();

        await loadLiveChatConversations();

        await loadCurrentOperator();

        lcLoaded = true;

        initializeLiveChatComposer();

        initializeLiveChatFilters();

        startLiveChatHeartbeat();

    } catch (error) {

        console.error(
                "Error inicializando LiveChat:",
                error
                );

        showLiveChatError(
                "No se pudo cargar el LiveChat."
                );
    }
}
async function loadLiveChatConversations() {

    const payload = {
        Accion:
                "GetLiveChatConversations",
        Parametro1: lcCurrentChannel
    };

    const response =
            await fetch(
                    contextPath + "/ProcesoDatosChat",
                    {
                        method: "POST",
                        credentials: "include",

                        headers: {
                            "Content-Type":
                                    "application/json"
                        },

                        body:
                                JSON.stringify(payload)
                    }
            );


    if (!response.ok) {
        throw new Error(
                `HTTP ${response.status}`
                );
    }


    const data =
            await response.json();


    console.log(
            "CONVERSACIONES:",
            data
            );


    lcConversations =
            Array.isArray(data)
            ? data
            : [];


    renderConversationList();


    /*
     * Opcional:
     * abrir automáticamente la primera.
     */
    if (
            !lcCurrentConversation &&
            lcConversations.length > 0
            ) {
        await selectConversation(
                lcConversations[0].Id
                );
    }
}
async function loadConversationMessages(conversationId, beforeId = null) {
    if (lcIsLoadingMessages)
        return;
    lcIsLoadingMessages = true;
    try {

        const payload = {
            Accion: "GetLiveChatMessages",
            Parametro1: conversationId,
            Parametro2: beforeId || "",
            Parametro3: 30
        };

        const response =
                await fetch(
                        contextPath +
                        "/ProcesoDatosChat",
                        {
                            method: "POST",
                            credentials:
                                    "include",

                            headers: {
                                "Content-Type":
                                        "application/json"
                            },

                            body:
                                    JSON.stringify(
                                            payload
                                            )
                        }
                );


        if (!response.ok) {
            throw new Error(
                    `HTTP ${response.status}`
                    );
        }


        const messages =
                await response.json();


        if (!Array.isArray(messages))
            return;


        if (beforeId) {

            lcMessages = [
                ...messages,
                ...lcMessages
            ];

        } else {

            lcMessages =
                    messages;
        }


        lcHasMoreMessages =
                messages.length === 30;


        if (lcMessages.length > 0) {

            lcOldestMessageId =
                    lcMessages[0].Id;
        }


        renderMessages();


        if (!beforeId) {
            scrollLiveChatBottom();
        }

    } catch (error) {

        console.error(
                "Error cargando mensajes:",
                error
                );

    } finally {

        lcIsLoadingMessages =
                false;
}
}
function renderConversationList() {

    const container =
            document.getElementById(
                    "lcConversationList"
                    );

    if (!container)
        return;

    container.innerHTML = "";

    const conversations =
            getFilteredConversations();

    if (conversations.length === 0) {

        const messages = {
            ALL: "No hay conversaciones.",
            AI: "No hay conversaciones atendidas por IA.",
            HUMAN: "No hay conversaciones atendidas por operadores.",
            UNREAD: "No hay conversaciones sin leer.",
            UNANSWERED: "No hay conversaciones pendientes de respuesta."
        };

        const empty =
                document.createElement("div");

        empty.className = "lc-empty";

        empty.textContent =
                messages[lcActiveFilter] ||
                "No hay conversaciones.";

        container.appendChild(empty);
        return;
    }

    const fragment =
            document.createDocumentFragment();

    conversations.forEach(conversation => {

        const item =
                createConversationItem(conversation);

        fragment.appendChild(item);
    });

    container.appendChild(fragment);
}
function getFilteredConversations() {

    return lcConversations.filter(conversation => {

        const mode = String(
                conversation.HandlingMode || ""
                ).toUpperCase();

        const sender = String(
                conversation.LastSenderType || ""
                ).toUpperCase();

        const unread = Number(
                conversation.UnreadCount || 0
                );

        switch (lcActiveFilter) {

            case "AI":
                return mode === "AI";

            case "HUMAN":
                return mode === "HUMAN";

            case "UNREAD":
                return unread > 0;

            case "UNANSWERED":
                return sender === "USER" &&
                        !isFarewellMessage(
                                conversation.LastMessage
                                );

            case "ALL":
            default:
                return true;
        }
    });
}
function isFarewellMessage(message) {

    if (!message)
        return false;

    const text = String(message)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, " ")
            .replace(/\s+/g, " ")
            .trim();

    const farewells = new Set([
        "gracias",
        "muchas gracias",
        "mil gracias",
        "ok gracias",
        "dale gracias",
        "perfecto gracias",
        "listo gracias",
        "chau",
        "chau gracias",
        "adios",
        "hasta luego",
        "hasta manana",
        "nos vemos",
        "saludos",
        "buenas noches gracias"
    ]);

    return farewells.has(text);
}
function createConversationItem(conversation) {

    const item =
            document.createElement("div");


    item.className =
            "lc-conversation-item";


    item.dataset.conversationId =
            conversation.Id;


    if (
            lcCurrentConversation &&
            lcCurrentConversation.Id ===
            conversation.Id
            ) {
        item.classList.add(
                "lc-selected"
                );
    }


    if (
            (conversation.UnreadCount || 0)
            > 0
            ) {
        item.classList.add(
                "lc-unread"
                );
    }


    const name =
            getConversationName(
                    conversation
                    );


    const initials =
            getInitials(name);


    const mode =
            (
                    conversation.HandlingMode
                    || "AI"
                    ).toUpperCase();


    const modeIcon =
            mode === "HUMAN"
            ? "bi-person"
            : "bi-robot";


    const channelIcon =
            getChannelIcon(
                    conversation.ChannelCode
                    );


    item.innerHTML = `

        <div class="lc-avatar">

            ${escapeLiveChatHtml(
            initials
            )}

            <span
                class="lc-avatar-channel">

                <i class="bi ${modeIcon}">
                </i>

            </span>

        </div>


        <div
            class="lc-conversation-info">

            <div
                class="lc-conversation-top">

                <span
                    class="lc-conversation-name">

                    ${escapeLiveChatHtml(
            name
            )}

                </span>

                <span
                    class="lc-conversation-time">

                    ${formatLiveChatTime(
            conversation
            .LastMessageAt
            )}

                </span>

            </div>


            <div
                class="lc-conversation-bottom">

                <div
                    class="lc-conversation-preview">

                    <i
                        class="bi ${channelIcon}">
                    </i>

                    <span>
                        ${escapeLiveChatHtml(
            truncateLiveChatText(
                    conversation
                    .LastMessage,
                    55
                    )
            )}
                    </span>

                </div>


                ${
            conversation.UnreadCount > 0
            ?
            `<span
                        class="lc-unread-dot">
                     </span>`
            :
            ""
            }

            </div>

        </div>
    `;


    item.addEventListener(
            "click",
            () => {
        selectConversation(
                conversation.Id
                );
    }
    );


    return item;
}
function getConversationName(c) {

    return c.CustomerName?.trim()
            || c.ExternalIdentifier?.trim()
            || `Conversación #${c.Id}`;
}
function getInitials(name) {

    if (!name)
        return "?";


    return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(x => x.charAt(0))
            .join("")
            .toUpperCase();
}
function getChannelIcon(
        channel
        ) {

    switch (
            (channel || "")
            .toUpperCase()
            ) {

        case "WHATSAPP":
            return "bi-whatsapp";

        case "WEB":
            return "bi-globe";

        case "GOOGLE_CHAT":
            return "bi-google";

        default:
            return "bi-chat";
    }
}
function truncateLiveChatText(text, max) {

    if (!text)
        return "";


    const clean =
            text.replace(/\s+/g, " ")
            .trim();


    if (clean.length <= max)
        return clean;


    return clean.substring(
            0,
            max
            ) + "...";
}
function formatLiveChatTime(
        value
        ) {

    if (!value)
        return "";


    const date =
            new Date(value);


    return date.toLocaleTimeString(
            "es-AR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
    );
}
function escapeLiveChatHtml(
        value
        ) {

    if (value == null)
        return "";


    const div =
            document.createElement("div");

    div.textContent =
            String(value);

    return div.innerHTML;
}
async function selectConversation(conversationId) {
    const conversation =
            lcConversations.find(
                    x =>
                x.Id ===
                        Number(conversationId)
            );
    if (!conversation)
        return;
    lcCurrentConversation = conversation;
    renderConversationList();
    renderConversationHeader(conversation);
    renderProductContext(conversation);
    updateAssignmentButton();
    lcMessages = [];
    lcOldestMessageId = null;
    lcHasMoreMessages = true;
    await loadConversationMessages(conversation.Id);
    await markConversationAsRead(conversation.Id);


}
function renderConversationHeader(
        conversation
        ) {

    const name =
            document.getElementById(
                    "lcContactName"
                    );

    const phone =
            document.getElementById(
                    "lcContactPhone"
                    );


    if (name) {

        name.textContent =
                getConversationName(
                        conversation
                        );
    }


    if (phone) {

        phone.textContent =
                conversation.ExternalIdentifier
                || conversation.ChannelCode
                || "";
    }
}
function getMessageSenderType(
        message
        ) {

    if (message.SenderType) {
        return message
                .SenderType
                .toUpperCase();
    }


    /*
     * Compatibilidad mensajes viejos.
     */
    const role =
            (message.Role || "")
            .toUpperCase();


    if (role === "USER")
        return "CUSTOMER";


    if (role === "ASSISTANT")
        return "AI";


    return "SYSTEM";
}
function renderMessages() {

    const container =
            document.getElementById(
                    "lcMessages"
                    );


    if (!container)
        return;


    container.innerHTML = "";


    if (lcMessages.length === 0) {

        container.innerHTML = `
            <div class="lc-empty-chat">
                No hay mensajes.
            </div>
        `;

        return;
    }


    lcMessages.forEach(
            message => {

                container.appendChild(
                        createMessageElement(
                                message
                                )
                        );
            }
    );
}
function createMessageElement(
        message
        ) {

    const senderType =
            getMessageSenderType(
                    message
                    );


    if (senderType === "CUSTOMER") {

        return createCustomerMessage(
                message
                );
    }


    if (senderType === "HUMAN") {

        return createHumanMessage(
                message
                );
    }


    return createAssistantMessage(
            message
            );
}

function createLiveChatAttachments(attachments) {

    const container = document.createElement("div");
    container.className = "lc-message-attachments";

    for (const attachment of attachments || []) {

        const id = Number(
                attachment.Id ?? attachment.id
                );
        const type = String(
                attachment.MediaType ??
                attachment.mediaType ??
                ""
                ).toUpperCase();

        if (!Number.isSafeInteger(id) || id <= 0)
            continue;

        const url =
                contextPath + "/LiveChatMedia?id=" + id;

        if (type === "IMAGE") {

            const link = document.createElement("a");

            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const img = document.createElement("img");

            img.src = url;
            img.alt = "Imagen enviada por el cliente";
            img.className = "lc-message-image";
            img.loading = "lazy";

            link.appendChild(img);
            container.appendChild(link);

        } else if (type === "AUDIO") {

            const audio = document.createElement("audio");

            audio.controls = true;
            audio.preload = "metadata";
            audio.className = "lc-message-audio";
            audio.src = url;

            container.appendChild(audio);
        }
    }

    return container;
}


function createCustomerMessage(message) {

    const row = document.createElement("div");

    row.className =
            "lc-message-row lc-message-customer";

    const name = lcCurrentConversation
            ? getConversationName(lcCurrentConversation)
            : "Cliente";

    row.innerHTML = `
        <div class="lc-message-avatar">
            ${escapeLiveChatHtml(getInitials(name))}
        </div>

        <div class="lc-message-stack">

            <div class="lc-message-sender">
                ${escapeLiveChatHtml(name)}
            </div>

            <div class="lc-message-bubble">

                <div class="lc-message-content">
                    ${formatLiveChatMessage(
            message.Content ?? message.content ?? ""
            )}
                </div>

                <span class="lc-message-time">
                    ${formatLiveChatTime(
            message.CreatedAt ?? message.createdAt
            )}
                </span>

            </div>
        </div>
    `;

    const attachments =
            message.Attachments ??
            message.attachments ??
            [];

    if (attachments.length > 0) {

        const bubble =
                row.querySelector(".lc-message-bubble");

        const content =
                row.querySelector(".lc-message-content");

        const attachmentsElement =
                createLiveChatAttachments(attachments);

        content.after(attachmentsElement);

        bubble.classList.add(
                "lc-message-bubble-media"
                );
    }

    return row;
}

function createAssistantMessage(
        message
        ) {

    const row =
            document.createElement("div");


    row.className =
            "lc-message-row lc-message-assistant";


    row.innerHTML = `

        <div
            class="lc-assistant-bubble">

            <div
                class="lc-assistant-header">

                <span>
                    <i class="bi bi-robot">
                    </i>

                    Asistente
                </span>

            </div>


            <div
                class="lc-assistant-text">

                ${formatLiveChatMessage(
            message.Content
            )}

            </div>


            <div
                class="lc-assistant-footer">

                <span>
                    ${formatLiveChatTime(
            message.CreatedAt
            )}
                </span>

                <i class="bi bi-check2-all">
                </i>

            </div>

        </div>


        <div
            class="lc-message-avatar lc-ai-avatar">
            AI
        </div>
    `;


    return row;
}
function createHumanMessage(
        message
        ) {

    const row =
            createAssistantMessage(
                    message
                    );


    row.classList.add(
            "lc-message-human"
            );


    const header =
            row.querySelector(
                    ".lc-assistant-header span"
                    );


    if (header) {

        header.innerHTML = `
            <i class="bi bi-person">
            </i>

            ${escapeLiveChatHtml(
                message.SenderName
                || "Agente"
                )}
        `;
    }


    const avatar =
            row.querySelector(
                    ".lc-message-avatar"
                    );


    if (avatar) {
        avatar.textContent = "AG";
    }


    return row;
}
function formatLiveChatMessage(
        text
        ) {

    if (!text)
        return "";


    let safe =
            escapeLiveChatHtml(text);


    /*
     * URLs -> links
     */
    safe = safe.replace(
            /(https?:\/\/[^\s<]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
            );


    /*
     * Saltos de línea.
     */
    safe =
            safe.replace(
                    /\n/g,
                    "<br>"
                    );


    return safe;
}
function scrollLiveChatBottom() {

    const container =
            document.getElementById(
                    "lcMessages"
                    );


    if (!container)
        return;


    requestAnimationFrame(
            () => {

        container.scrollTop =
                container.scrollHeight;
    }
    );
}
document
        .getElementById("lcMessages")
        ?.addEventListener(
                "scroll",
                async function () {

                    if (
                            this.scrollTop > 80 ||
                            !lcHasMoreMessages ||
                            lcIsLoadingMessages ||
                            !lcCurrentConversation
                            ) {
                        return;
                    }


                    const oldHeight =
                            this.scrollHeight;


                    await loadConversationMessages(
                            lcCurrentConversation.Id,
                            lcOldestMessageId
                            );


                    const newHeight =
                            this.scrollHeight;


                    this.scrollTop =
                            newHeight -
                            oldHeight;
                }
        );
async function connectLiveChat() {

    if (lcSocketConnecting ||
        lcSocket?.readyState === WebSocket.OPEN ||
        lcSocket?.readyState === WebSocket.CONNECTING) {
        return;
    }

    lcSocketConnecting = true;

    try {
        const response = await fetch(
            contextPath + "/livechat/token",
            {
                method: "POST",
                credentials: "include",
                cache: "no-store"
            }
        );

        if (response.status === 401) {
            handleLiveChatUnauthorized();
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Error obteniendo JWT: HTTP " + response.status
            );
        }

        const data = await response.json();

        if (data.success !== true ||
            typeof data.token !== "string" ||
            !data.token.trim()) {

            throw new Error("El servidor no devolvió un JWT válido");
        }

        connectLiveChatSocket(data.token);

    } catch (error) {

        console.error("Error conectando LiveChat:", error);

        scheduleLiveChatReconnect();

    } finally {
        lcSocketConnecting = false;
    }
}
function scheduleLiveChatReconnect() {

    if (lcSocketReconnectTimer !== null)
        return;

    lcSocketReconnectTimer = setTimeout(() => {

        lcSocketReconnectTimer = null;
        connectLiveChat();

    }, 3000);
}
function connectLiveChatSocket(token) {

    if (typeof token !== "string" || !token.trim()) {
        console.error("Se intentó conectar WS sin JWT");
        scheduleLiveChatReconnect();
        return;
    }

    const protocol = location.protocol === "https:"
            ? "wss:"
            : "ws:";
    //const url = "ws://localhost:47994/ws/livechat?token=" +  encodeURIComponent(token);
    const url = protocol + "//" +  window.location.host + "/ws/livechat?token=" + encodeURIComponent(token);

    const ws = new WebSocket(url);
    lcSocket = ws;

    ws.onopen = () => {

        if (lcSocket !== ws)
            return;

        console.log("LiveChat WS conectado");

        if (lcSocketReconnectTimer !== null) {
            clearTimeout(lcSocketReconnectTimer);
            lcSocketReconnectTimer = null;
        }

        startLiveChatWsHeartbeat();
        startLiveChatHeartbeat();
        updateChatInput();
    };

    ws.onmessage = event => {

        if (lcSocket !== ws)
            return;

        if (event.data === "PONG")
            return;

        try {
            handleLiveChatEvent(JSON.parse(event.data));
        } catch (error) {
            console.error("Evento WS inválido:", error);
        }
    };

    ws.onerror = error => {
        if (lcSocket === ws)
            console.error("LiveChat WS error:", error);
    };

    ws.onclose = event => {

        if (lcSocket !== ws)
            return;

        console.warn(
            "LiveChat WS desconectado:",
            event.code,
            event.reason
        );

        lcSocket = null;

        stopLiveChatWsHeartbeat();
        updateChatInput();

        scheduleLiveChatReconnect();
    };
}
function handleLiveChatEvent(
        event
        ) {

    console.log(
            "LIVECHAT EVENT:",
            event
            );


    switch (event.type) {

        case "MESSAGE_CREATED":
            handleMessageCreated(event);
            break;

        case "CONVERSATION_UPDATED":
            handleConversationUpdated(event);
            break;

        case "READ_UPDATED":
            handleReadUpdated(event);
            break;

        case "MESSAGE_ACCEPTED":
            handleMessageAccepted(event);
            break;

        case "CONVERSATION_EVENT":
            handleConversationEvent(event);
            break;

        case "MESSAGE_ERROR":
            handleMessageError(event);
            break;

        case "PONG":
            break;


        default:

            console.warn(
                    "Evento desconocido:",
                    event.type
                    );
    }
}
async function handleMessageAccepted(event) {

    const pending = lcPendingMessages.get(event.requestId);

    if (!pending)
        return;

    lcPendingMessages.delete(event.requestId);

    if (lcCurrentConversation?.Id === pending.conversationId) {

        const input = document.getElementById("lcMessageInput");

        // No borrar texto nuevo que el operador escribió
        // mientras esperaba la confirmación.
        if (input?.value.trim() === pending.content) {
            input.value = "";
        }
        await loadConversationMessages(pending.conversationId);

        input?.focus();
    }

    updateChatInput();
}
function handleReadUpdated(data) {

    console.log("READ_UPDATED recibido:", data);

    const conversationId = Number(
            data.conversationId ?? data.ConversationId
            );

    if (!conversationId)
        return;

    const conversation = lcConversations.find(
            c => Number(c.Id ?? c.id) === conversationId
    );

    if (!conversation)
        return;

    // Si el backend envía el contador actualizado.
    const unreadCount = data.unreadCount ?? data.UnreadCount;

    if (unreadCount !== undefined && unreadCount !== null) {
        conversation.UnreadCount = Number(unreadCount);
    } else {
        // Si solamente notifica que la conversación fue leída.
        conversation.UnreadCount = 0;
    }

    // Actualizar la lista lateral.
    renderConversationList();
}
function handleMessageError(event) {

    lcPendingMessages.delete(event.requestId);

    alert(event.message || "No se pudo enviar el mensaje.");

    updateChatInput();
}
function handleMessageCreated(event) {

    const conversationId = Number(event.conversationId);
    const message = event.message;
    if (!message)
        return;
    /*
     * 1. Actualizamos lista izquierda.
     */

    let conversation = lcConversations.find(x => x.Id === conversationId);

    if (conversation) {
        conversation.LastMessage =
                message.content;

        conversation.LastMessageAt =
                message.createdAt;

        conversation.LastSenderType =
                message.senderType;


        /*
         * Si NO está abierta,
         * aumenta unread.
         */
        if (!lcCurrentConversation || lcCurrentConversation.Id !== conversationId) {
            if ((message.senderType || "").toUpperCase() === "CUSTOMER") {
                conversation.UnreadCount = (conversation.UnreadCount || 0) + 1;
            }
        }
        /*
         * Mover arriba.
         */
        lcConversations =
                lcConversations.filter(
                        x =>
                    x.Id !==
                            conversationId
                );


        lcConversations.unshift(
                conversation
                );


        renderConversationList();

    } else {
        loadLiveChatConversations();
    }
    if (lcCurrentConversation && lcCurrentConversation.Id === conversationId) {

        const normalized = {
            Id: message.id,
            ConversationId: conversationId,
            Role: message.role,
            SenderType: message.senderType,
            SenderUserId: message.senderUserId,
            SenderName: message.senderName,
            Content: message.content,
            CreatedAt: message.createdAt,

            Attachments:
                    message.attachments ??
                    message.Attachments ??
                    []
        };


        /*
         * Evitar duplicado.
         */
        if (!lcMessages.some(x => x.Id === normalized.Id)) {

            lcMessages.push(normalized);
            const container = document.getElementById("lcMessages");
            container?.appendChild(
                    createMessageElement(
                            normalized
                            )
                    );


            scrollLiveChatBottom();
        }
    }
}

function handleConversationUpdated(
        event
        ) {

    const conversation =
            lcConversations.find(
                    x =>
                x.Id ===
                        Number(
                                event.conversationId
                                )
            );


    if (!conversation)
        return;


    conversation.HandlingMode =
            event.handlingMode;

    conversation.AssignedUserId =
            event.assignedUserId;

    conversation.AssignedUserName =
            event.assignedUserName;


    renderConversationList();


    if (
            lcCurrentConversation &&
            lcCurrentConversation.Id ===
            conversation.Id
            ) {

        lcCurrentConversation =
                conversation;

        updateAssignmentButton();
        updateChatInput();
    }
}
async function markConversationAsRead(conversationId) {
    try {
        const response =
                await fetch(
                        contextPath + "/ProcesoDatosChat",
                        {
                            method: "POST",

                            credentials: "include",

                            headers: {
                                "Content-Type":
                                        "application/json"
                            },

                            body: JSON.stringify({
                                Accion: "MarkLiveChatRead",
                                Parametro1: conversationId
                            })
                        }
                );


        if (!response.ok) {

            console.error(
                    "Error marcando conversación como leída:",
                    response.status
                    );

            return;
        }
        const conversation =
                lcConversations.find(
                        x =>
                    x.Id ===
                            Number(conversationId)
                );


        if (conversation) {

            conversation.UnreadCount = 0;

            renderConversationList();
        }

    } catch (error) {

        console.error(
                "Error MarkAsRead:",
                error
                );
    }
}
function updateAssignmentButton() {

    const button =
            document.getElementById("lcAssignmentButton");

    const text =
            document.getElementById("lcAssignmentText");

    if (!button || !text)
        return;

    button.classList.remove("lc-human-active");

    if (!lcCurrentConversation ||
            !Number.isFinite(lcCurrentOperatorId)) {

        text.textContent = "Tomar conversación";
        button.disabled = true;
        return;
    }

    const mode = (
            lcCurrentConversation.HandlingMode || "AI"
            ).toUpperCase();

    const assignedId = lcCurrentConversation.AssignedUserId == null
            ? null
            : Number(lcCurrentConversation.AssignedUserId);

    if (mode === "HUMAN") {

        if (assignedId === null) {
            text.textContent = "Tomar conversación";
        } else if (assignedId === lcCurrentOperatorId) {
            text.textContent = "Devolver a IA";
            button.classList.add("lc-human-active");
        } else {
            text.textContent = "Tomar de otro operador";
        }

    } else if (mode === "PENDING_HUMAN" ||
            mode === "PENDING-HUMAN") {

        text.textContent = "Atender solicitud";

    } else {

        text.textContent = "Tomar conversación";
    }

    button.disabled = false;
}
document.getElementById("lcAssignmentButton")?.addEventListener("click", changeCurrentAssignment);
async function changeCurrentAssignment() {

    if (!lcCurrentConversation)
        return;

    const conversation = lcCurrentConversation;

    const mode = (
            conversation.HandlingMode || "AI"
            ).toUpperCase();

    const assignedId = conversation.AssignedUserId === null
            ? null
            : Number(conversation.AssignedUserId);

    const isMine =
            mode === "HUMAN" &&
            assignedId === lcCurrentOperatorId;

    const isOtherOperator =
            mode === "HUMAN" &&
            assignedId !== null &&
            assignedId !== lcCurrentOperatorId;

    let action;
    let parametro2 = null;

    if (isMine) {

        if (!confirm(
                "¿Querés devolver esta conversación a la IA?"
                ))
            return;

        action = "ReturnConversationToAI";

    } else if (isOtherOperator) {

        const name =
                conversation.AssignedUserName ||
                "otro operador";

        if (!confirm(
                `Esta conversación está asignada a ${name}.\n\n` +
                "¿Querés tomarla y reemplazar al operador actual?"
                ))
            return;

        action = "TakeOverConversation";
        parametro2 = assignedId;

    } else {

        action = "TakeConversation";
    }

    const button =
            document.getElementById("lcAssignmentButton");

    if (button?.disabled)
        return;

    button.disabled = true;

    try {

        const response = await fetch(
                contextPath + "/ProcesoDatosChat",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Accion: action,
                        Parametro1: conversation.Id,
                        ...(parametro2 !== null
                                ? {Parametro2: parametro2}
                        : {})
                    })
                }
        );

        if (response.status === 401) {
            handleLiveChatUnauthorized();
            return;
        }

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                    result.message ||
                    "No se pudo cambiar la asignación."
                    );
        }

        conversation.HandlingMode = result.handlingMode;
        conversation.AssignedUserId = result.assignedUserId;
        conversation.AssignedUserName =
                result.assignedUserName || null;

        renderConversationList();
        updateAssignmentButton();
        updateChatInput();

    } catch (error) {

        console.error("Error de asignación:", error);
        alert(error.message);

        // Recargar para obtener el operador actual
        // si hubo un conflicto de concurrencia.
        await loadLiveChatConversations();

    } finally {

        if (button)
            button.disabled = false;
    }
}



function startLiveChatWsHeartbeat() {

    stopLiveChatWsHeartbeat();


    lcHeartbeat =
            setInterval(
                    () => {

                if (
                        lcSocket &&
                        lcSocket.readyState ===
                        WebSocket.OPEN
                        ) {
                    lcSocket.send(
                            "PING"
                            );
                }

            },
                    25000
                    );
}


function stopLiveChatWsHeartbeat() {

    if (lcHeartbeat) {

        clearInterval(
                lcHeartbeat
                );

        lcHeartbeat = null;
    }
}
const lcPendingMessages = new Map();
function sendLiveChatMessage() {

    if (!lcCurrentConversation)
        return;

    if (lcCurrentConversation.HandlingMode?.toUpperCase() !== "HUMAN")
        return;

    if (!lcSocket || lcSocket.readyState !== WebSocket.OPEN) {
        alert("No hay conexión con LiveChat.");
        return;
    }

    const input = document.getElementById("lcMessageInput");

    if (!input)
        return;

    const content = input.value.trim();

    if (!content)
        return;

    const requestId = crypto.randomUUID();

    lcPendingMessages.set(requestId, {
        conversationId: lcCurrentConversation.Id,
        content: content
    });

    lcSocket.send(JSON.stringify({
        type: "SEND_MESSAGE",
        requestId: requestId,
        conversationId: lcCurrentConversation.Id,
        content: content
    }));

    // No borramos todavía: esperamos la confirmación.
    updateChatInput();
}
function renderProductContext(conversation) {

    const container = document.getElementById("lcProductContext");

    if (!container)
        return;

    container.replaceChildren();
    container.hidden = true;

    if (
            conversation.ChannelCode !== "mercado_libre" ||
            !conversation.OriginUrl
            ) {
        return;
    }

    const card = document.createElement("div");
    card.className = "lc-product-card";

    const title = document.createElement("strong");
    title.textContent = `Publicación ${conversation.OriginUrl}`;

    card.appendChild(title);

    if (conversation.OriginUrl) {
        const link = document.createElement("a");

        link.href = conversation.OriginUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Ver en Mercado Libre ↗";

        card.appendChild(link);
    }

    container.appendChild(card);
    container.hidden = false;
}
function handleConversationEvent(event) {

    const conversationId = Number(event.conversationId);

    const conversation = lcConversations.find(
            c => Number(c.Id) === conversationId
    );

    if (conversation) {
        conversation.HandlingMode = event.handlingMode;
        renderConversationList();
    }

    if (Number(lcCurrentConversation?.Id) !== conversationId)
        return;

    updateAssignmentButton();
    updateChatInput();

    if (event.eventType === "TRANSFER_REQUESTED") {

        const container = document.getElementById("lcMessages");

        if (!container)
            return;

        const alert = document.createElement("div");
        alert.className = "lc-transfer-alert";

        alert.innerHTML = `
            <div class="lc-transfer-alert-icon">
                <i class="bi bi-person-raised-hand"></i>
            </div>

            <div class="lc-transfer-alert-content">
                <strong>Transferencia solicitada</strong>
                <span>
                    La IA derivó esta conversación.
                    Esperando que un operador la tome.
                </span>
            </div>

            <div class="lc-transfer-alert-status">
                <i class="bi bi-clock"></i>
                Pendiente
            </div>
        `;

        container.appendChild(alert);

        scrollLiveChatBottom();
    }
}
