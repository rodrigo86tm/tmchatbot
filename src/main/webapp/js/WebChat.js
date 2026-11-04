class WebChat {

    constructor() {

        this.socket = null;

        this.token = null;

        this.connected = false;

        this.conversationId = null;

        this.oldestMessageId = null;

        this.loadingHistory = false;

        this.hasMoreMessages = true;

        this.initialHistoryLoaded = false;

        this.connecting = false;
        
        this.heartbeatInterval = null;
        
        this.reconnectTimer = null;


        this.button =
            document.getElementById("chatButton");

        this.window =
            document.getElementById("chatWindow");

        this.closeButton =
            document.getElementById("chatClose");

        this.messages =
            document.getElementById("chatMessages");

        this.input =
            document.getElementById("chatInput");

        this.sendButton =
            document.getElementById("chatSend");

        this.status =
            document.getElementById("chatStatus");

        this.typing =
            document.getElementById("chatTyping");

        this.loading =
            document.getElementById("chatLoading");


        this.registerEvents();
    }


    registerEvents() {

        this.button.addEventListener(
            "click",
            () => this.open()
        );


        this.closeButton.addEventListener(
            "click",
            () => this.close()
        );


        this.sendButton.addEventListener(
            "click",
            () => this.send()
        );


        this.input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    this.send();
                }
            }
        );


        this.messages.addEventListener(
            "scroll",
            () => this.handleScroll()
        );
    }


    async open() {

        this.window.classList.remove(
            "chat-hidden"
        );


        if (this.connected ||
            this.connecting) {

            this.input.focus();

            return;
        }


        await this.startChat();
    }


    close() {

        this.window.classList.add(
            "chat-hidden"
        );
    }


    async startChat() {

        try {

            this.connecting = true;

            this.setStatus(
                "Conectando..."
            );


            /*
             * 1.
             * Pedimos al Servlet el token
             */

            const response =
                await fetch(contextPath +
                    '/chat/token',
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "No se pudo obtener el token del chat."
                );
            }


            const data =
                await response.json();


            this.token =
                data.token;


            /*
             * 2.
             * Recién ahora abrimos WebSocket
             */

            this.connectWebSocket();

        }
        catch (error) {

            console.error(
                "Error iniciando chat:",
                error
            );

            this.setStatus(
                "No se pudo conectar"
            );

            this.connecting = false;
        }
    }


    connectWebSocket() {

        const protocol =
            window.location.protocol === "https:"
                ? "wss:"
                : "ws:";

        //const url = "ws://localhost:47994/ws/chat?token=" + encodeURIComponent(this.token);
        const url =protocol +"//" + window.location.host + "/ws/chat?token=" +encodeURIComponent(this.token);


        this.socket =
            new WebSocket(url);


        this.socket.onopen =
            () => {

                console.log(
                    "WebSocket conectado"
                );

                this.connected = true;

                this.connecting = false;

                this.setStatus(
                    "En línea"
                );

                this.sendButton.disabled =
                    false;

                this.startHeartbeat();
                /*
                 * El historial se pide
                 * por el mismo WebSocket.
                 */

                if (!this.initialHistoryLoaded) {

                    this.requestHistory();
                }


                this.input.focus();
            };


        this.socket.onmessage =
            event => {

                try {

                    const data =
                        JSON.parse(
                            event.data
                        );

                    this.handleServerMessage(
                        data
                    );

                }
                catch (error) {

                    console.error(
                        "Mensaje WS inválido:",
                        error
                    );
                }
            };


        this.socket.onerror =
            error => {

                console.error(
                    "WebSocket error:",
                    error
                );

                this.setStatus(
                    "Error de conexión"
                );
            };


        this.socket.onclose =
            event => {

                console.log(
                    "WebSocket cerrado:",
                    event.code,
                    event.reason
                );
                this.stopHeartbeat();

                this.connected = false;

                this.connecting = false;

                this.sendButton.disabled =
                    true;

                this.setStatus(
                    "Desconectado"
                );

                this.socket = null;
                
                this.scheduleReconnect();
            };
    }
    scheduleReconnect() {

        if (this.reconnectTimer)
            return;

        this.reconnectTimer =
            setTimeout(() => {

                this.reconnectTimer = null;

                if (!this.connected &&
                    !this.connecting) {

                    this.startChat();
                }

            }, 3000);
    }
    startHeartbeat() {

        this.stopHeartbeat();

        this.heartbeatInterval =
            setInterval(() => {

                if (
                    this.socket &&
                    this.socket.readyState === WebSocket.OPEN
                ) {

                    this.socket.send(
                        JSON.stringify({
                            type: "PING"
                        })
                    );
                }

            }, 25000);
    }
    stopHeartbeat() {

        if (this.heartbeatInterval) {

            clearInterval(
                this.heartbeatInterval
            );

            this.heartbeatInterval = null;
        }
    }

    send() {

        const text =
            this.input.value.trim();


        if (!text)
            return;


        if (!this.socket ||
            this.socket.readyState !==
                WebSocket.OPEN) {

            this.setStatus(
                "Sin conexión"
            );

            return;
        }


        const messageId =
            crypto.randomUUID();


        /*
         * Mostrar inmediatamente
         * el mensaje del usuario.
         */

        this.addMessage(
            {
                id: messageId,

                role: "USER",

                text: text,

                createdAt:
                    new Date().toISOString()
            },

            true
        );


        this.input.value = "";


        this.socket.send(
            JSON.stringify({

                type: "MESSAGE",

                messageId:
                    messageId,

                text:
                    text
            })
        );
    }


    requestHistory() {

        if (!this.connected)
            return;


        this.loadingHistory =
            true;


        this.showLoading(true);


        this.socket.send(
            JSON.stringify({

                type: "HISTORY",

                beforeId:
                    this.oldestMessageId,

                limit: 20
            })
        );
    }


    handleScroll() {

        if (
            this.messages.scrollTop <= 50 &&
            !this.loadingHistory &&
            this.hasMoreMessages
        ) {

            this.requestHistory();
        }
    }


    handleServerMessage(data) {

        switch (data.type) {

            case "MESSAGE":

                this.addMessage(
                    {
                        id: data.id,

                        role: data.role,

                        text: data.text,

                        createdAt:
                            data.createdAt
                    },

                    false
                );

                break;


            case "HISTORY":

                this.handleHistory(
                    data
                );

                break;


            case "TYPING":

                this.showTyping(
                    data.value
                );

                break;


            case "ACK":

                console.log(
                    "ACK:",
                    data.messageId
                );

                break;
            case "PONG":

                console.log(
                    "PONG recibido",
                    data.timestamp
                );

                break;        

            case "ERROR":

                console.error(
                    "Chat error:",
                    data.message
                );

                break;


            default:

                console.warn(
                    "Tipo desconocido:",
                    data.type
                );
        }
    }


    handleHistory(data) {

        this.loadingHistory =
            false;


        this.showLoading(false);


        const messages =
            data.messages || [];


        this.hasMoreMessages =
            data.hasMore === true;


        if (messages.length === 0) {

            this.initialHistoryLoaded =
                true;

            return;
        }


        /*
         * Guardamos la posición
         * para que el scroll no salte.
         */

        const oldHeight =
            this.messages.scrollHeight;


        const oldTop =
            this.messages.scrollTop;


        /*
         * El servidor devuelve
         * mensajes del más antiguo
         * al más nuevo.
         */

        for (
            let i = messages.length - 1;
            i >= 0;
            i--
        ) {

            this.addMessage(
                messages[i],
                false,
                true
            );
        }


        this.oldestMessageId =
            messages[0].id;


        /*
         * Si es la primera carga,
         * mostramos el final.
         */

        if (!this.initialHistoryLoaded) {

            this.initialHistoryLoaded =
                true;


            this.scrollToBottom();

        }
        else {

            /*
             * Mantener posición
             * al cargar mensajes viejos.
             */

            const newHeight =
                this.messages.scrollHeight;


            this.messages.scrollTop =
                newHeight -
                oldHeight +
                oldTop;
        }
    }


    addMessage(
        message,
        scroll,
        prepend = false
    ) {

        const bubble =
            document.createElement(
                "div"
            );


        bubble.classList.add(
            "chat-message"
        );


        if (
            message.role === "USER"
        ) {

            bubble.classList.add(
                "chat-message-user"
            );

        }
        else {

            bubble.classList.add(
                "chat-message-assistant"
            );
        }


        const text =
            document.createElement(
                "span"
            );


        text.textContent =
            message.text || "";


        bubble.appendChild(text);


        if (message.createdAt) {

            const time =
                document.createElement(
                    "span"
                );


            time.classList.add(
                "chat-message-time"
            );


            time.textContent =
                this.formatTime(
                    message.createdAt
                );


            bubble.appendChild(time);
        }


        if (prepend) {

            this.messages.insertBefore(
                bubble,
                this.messages.firstChild
            );

        }
        else {

            this.messages.appendChild(
                bubble
            );
        }


        if (scroll) {

            this.scrollToBottom();
        }
    }


    scrollToBottom() {

        requestAnimationFrame(
            () => {

                this.messages.scrollTop =
                    this.messages.scrollHeight;

            }
        );
    }


    showTyping(value) {

        if (value) {

            this.typing.classList.remove(
                "chat-hidden"
            );

        }
        else {

            this.typing.classList.add(
                "chat-hidden"
            );
        }
    }


    showLoading(value) {

        if (value) {

            this.loading.classList.remove(
                "chat-hidden"
            );

        }
        else {

            this.loading.classList.add(
                "chat-hidden"
            );
        }
    }


    setStatus(text) {

        this.status.textContent =
            text;


        if (text === "En línea") {

            this.status.classList.add(
                "connected"
            );

        }
        else {

            this.status.classList.remove(
                "connected"
            );
        }
    }


    formatTime(date) {

        if (!date)
            return "";


        return new Date(date)
            .toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    }
}
