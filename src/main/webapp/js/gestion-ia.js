const app = document.getElementById("app");
    const sidebarToggle =document.getElementById("sidebarToggle");
    const chatCollapse =document.getElementById("chatCollapse");
    const openChat =document.getElementById("openChat");
    /* =========================================================
       SIDEBAR
    ========================================================= */
    sidebarToggle.addEventListener("click", () => {
        app.classList.toggle("sidebar-collapsed");
    });
    /* =========================================================
       CHAT
    ========================================================= */
    chatCollapse.addEventListener("click", () => {
        app.classList.add("chat-collapsed");
    });
    openChat.addEventListener("click", () => {
        app.classList.remove("chat-collapsed");
    });
    /* =========================================================
       EXPANDIR SECCIONES
    ========================================================= */
    document.querySelectorAll(".prompt-card")
        .forEach(card => {
            const header =card.querySelector(".prompt-card-header");
            header.addEventListener("click", event => {
                /*
                 * Evitamos abrir/cerrar cuando el usuario
                 * toca un switch u otro control.
                 */
                if (
                    event.target.closest(".switch") ||
                    event.target.closest("button")
                ) {
                    return;
                }
                card.classList.toggle("expanded");
            });
            const expandButton = card.querySelector(".expand-btn");
            if (expandButton) {
                expandButton.addEventListener(
                    "click",event => {
                        event.stopPropagation();
                        card.classList.toggle("expanded");
                    }
                );
            }
        });
    /* =========================================================
       TABS SUPERIORES
    ========================================================= */
    document.querySelectorAll(".agent-tab")
        .forEach(tab => {
            tab.addEventListener("click", () => {
                if (tab.classList.contains("tab-menu"))
                    return;
                document
                    .querySelectorAll(".agent-tab")
                    .forEach(x =>
                        x.classList.remove("active")
                    );
                tab.classList.add("active");
            });
        });
    /* =========================================================
       SUB TABS
    ========================================================= */
    document.querySelectorAll(".sub-tab")
        .forEach(tab => {
            tab.addEventListener("click", () => {
                document
                    .querySelectorAll(".sub-tab")
                    .forEach(x => {
                        x.classList.remove("active");
                        x.classList.remove("selected");
                    });
                tab.classList.add("active");
            });
        });
    /* =========================================================
       TEXTAREA AUTO HEIGHT
    ========================================================= */
    const textarea = document.getElementById("testMessage");
    textarea.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height =
            Math.min(this.scrollHeight, 120) + "px";
    });
    /* =========================================================
       CHAT DE PRUEBA
    ========================================================= */
    const sendButton = document.getElementById("sendTestMessage");
    const chatBody = document.getElementById("chatBody");
    sendButton.addEventListener("click", sendMessage);
    textarea.addEventListener("keydown", event => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            sendMessage();
        }
    });
    function sendMessage() {
        const message = textarea.value.trim();
        if (!message)
            return;
        /*
         * Quitamos la pantalla inicial.
         */
        const empty = chatBody.querySelector(".empty-chat");
        if (empty)
            empty.remove();
        /*
         * Agregamos mensaje.
         */
        const wrapper = document.createElement("div");
        wrapper.className ="chat-message user";
        const bubble = document.createElement("div");
        bubble.className ="message-bubble";
        bubble.textContent = message;
        wrapper.appendChild(bubble);
        chatBody.appendChild(wrapper);
        /*
         * Limpiamos textarea.
         */
        textarea.value = "";
        textarea.style.height = "auto";
        /*
         * Scroll abajo.
         */
        chatBody.scrollTop =chatBody.scrollHeight;
        /*
         * ACÁ después conectaremos:
         *
         * POST /api/agent/test
         *
         * y agregaremos la respuesta
         * de Musa al chat.
         */
    }
