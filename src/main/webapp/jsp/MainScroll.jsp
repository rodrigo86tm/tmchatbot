<div class="lc-app" id="lcApp">

    <!-- =========================================
         COLUMNA IZQUIERDA - CONVERSACIONES
    ========================================== -->
    <aside class="lc-sidebar">

        <!-- BUSCADOR -->
        <div class="lc-search-row">

            <div class="lc-search-box">
                <i class="bi bi-search"></i>

                <input
                    id="lcSearch"
                    type="text"
                    placeholder="Buscar conversaciones..."
                    autocomplete="off">
            </div>

            <button
                type="button"
                class="lc-icon-btn"
                title="Nueva conversación">

                <i class="bi bi-chat-square-plus"></i>

            </button>

            <button
                type="button"
                class="lc-icon-btn"
                title="Filtros">

                <i class="bi bi-funnel"></i>

            </button>

            <button
                type="button"
                class="lc-icon-btn lc-more-btn"
                title="Más opciones">

                <i class="bi bi-three-dots-vertical"></i>

            </button>

        </div>


        <!-- FILTROS -->
        <div class="lc-filter-row">

            <button
                type="button"
                class="lc-filter-btn lc-filter-active">

                Todos

            </button>

            <button
                type="button"
                class="lc-filter-btn">

                <i class="bi bi-robot"></i>
                IA

            </button>

            <button
                type="button"
                class="lc-filter-btn">

                <i class="bi bi-person"></i>
                Humano

            </button>

            <button
                type="button"
                class="lc-filter-btn">

                <i class="bi bi-chat-square"></i>
                Sin leer

            </button>

            <button
                type="button"
                class="lc-icon-btn lc-archive-btn"
                title="Archivadas">

                <i class="bi bi-archive"></i>

            </button>

        </div>


        <!-- =====================================
             LISTADO
        ====================================== -->
        <div
            class="lc-conversation-list"
            id="lcConversationList">


            <!-- SELECCIONADA -->
            <div
                class="lc-conversation-item lc-selected"
                data-conversation-id="1">

                <div class="lc-avatar">
                    A

                    <span class="lc-avatar-channel">
                        <i class="bi bi-robot"></i>
                    </span>
                </div>

                <div class="lc-conversation-info">

                    <div class="lc-conversation-top">

                        <span class="lc-conversation-name">
                            ale
                        </span>

                        <span class="lc-conversation-time">
                            18:38
                        </span>

                    </div>

                    <div class="lc-conversation-bottom">

                        <div class="lc-conversation-preview">

                            <i class="bi bi-whatsapp"></i>

                            <i class="bi bi-check2-all lc-check"></i>

                            <span>
                                Tengo este que te puede servir...
                            </span>

                        </div>

                        <span class="lc-conversation-status">
                            <i class="bi bi-person-gear"></i>
                        </span>

                    </div>

                </div>

            </div>


            <!-- CONVERSACIÓN -->
            <div
                class="lc-conversation-item"
                data-conversation-id="2">

                <div class="lc-avatar">
                    S

                    <span class="lc-avatar-channel">
                        <i class="bi bi-robot"></i>
                    </span>
                </div>

                <div class="lc-conversation-info">

                    <div class="lc-conversation-top">

                        <span class="lc-conversation-name">
                            Solange
                        </span>

                        <span class="lc-conversation-time">
                            18:37
                        </span>

                    </div>

                    <div class="lc-conversation-bottom">

                        <div class="lc-conversation-preview">

                            <i class="bi bi-whatsapp"></i>

                            <i class="bi bi-check2-all lc-check"></i>

                            <span>
                                ¡La encontré! Tenemos...
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            <!-- CONVERSACIÓN -->
            <div
                class="lc-conversation-item"
                data-conversation-id="3">

                <div class="lc-avatar">
                    T
                </div>

                <div class="lc-conversation-info">

                    <div class="lc-conversation-top">

                        <span class="lc-conversation-name">
                            Teresa
                        </span>

                        <span class="lc-conversation-time">
                            18:26
                        </span>

                    </div>

                    <div class="lc-conversation-bottom">

                        <div class="lc-conversation-preview">

                            <i class="bi bi-whatsapp"></i>

                            <i class="bi bi-check2-all"></i>

                            <span>
                                De nada, Teresa. Cualquier...
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            <!-- TRANSFERIDA / NO LEÍDA -->
            <div
                class="lc-conversation-item lc-unread"
                data-conversation-id="4">

                <div class="lc-avatar">
                    A

                    <span class="lc-human-badge">
                        V
                    </span>
                </div>

                <div class="lc-conversation-info">

                    <div class="lc-conversation-top">

                        <span class="lc-conversation-name">
                            Adri
                        </span>

                        <span class="lc-conversation-time">
                            18:22
                        </span>

                    </div>

                    <div class="lc-conversation-bottom">

                        <div class="lc-conversation-preview">

                            <i class="bi bi-person"></i>

                            <i class="bi bi-whatsapp"></i>

                            <span>
                                Transferido a agente humano
                            </span>

                        </div>

                        <span class="lc-unread-dot"></span>

                    </div>

                </div>

            </div>


            <div
                class="lc-conversation-item"
                data-conversation-id="5">

                <div class="lc-avatar">
                    LF
                </div>

                <div class="lc-conversation-info">

                    <div class="lc-conversation-top">

                        <span class="lc-conversation-name">
                            Licila Figueroa
                        </span>

                        <span class="lc-conversation-time">
                            18:12
                        </span>

                    </div>

                    <div class="lc-conversation-bottom">

                        <div class="lc-conversation-preview">

                            <i class="bi bi-whatsapp"></i>

                            <span>
                                ¡De nada! Quedo a tu disposición...
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            <div
                class="lc-conversation-item"
                data-conversation-id="6">

                <div class="lc-avatar">
                    GT
                </div>

                <div class="lc-conversation-info">

                    <div class="lc-conversation-top">

                        <span class="lc-conversation-name">
                            Gustavo Tabara
                        </span>

                        <span class="lc-conversation-time">
                            18:09
                        </span>

                    </div>

                    <div class="lc-conversation-bottom">

                        <div class="lc-conversation-preview">

                            <i class="bi bi-whatsapp"></i>

                            <span>
                                Mirá, para saber el valor...
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </aside>


    <!-- =========================================
         CHAT
    ========================================== -->
    <section class="lc-chat">


        <!-- =====================================
             HEADER
        ====================================== -->
        <header class="lc-chat-header">

            <div class="lc-chat-header-top">

                <div class="lc-contact">

                    <div class="lc-contact-name">
                        ale

                        <i class="bi bi-robot"></i>
                    </div>

                    <div class="lc-contact-phone">
                        91165105035
                    </div>

                </div>


                <div class="lc-chat-actions">

                    <button
                        type="button"
                        class="lc-convert-btn">

                        <i class="bi bi-graph-up-arrow"></i>
                        Convertir

                    </button>

                    <button
                        type="button"
                        class="lc-header-icon">

                        <i class="bi bi-person"></i>

                    </button>

                    <button
                        type="button"
                        class="lc-header-icon">

                        <i class="bi bi-three-dots-vertical"></i>

                    </button>

                </div>

            </div>


            <!-- SEGUNDA FILA -->
            <div class="lc-chat-header-bottom">

                <div class="lc-channel-actions">

                    <div class="lc-channel-pill">

                        <i class="bi bi-whatsapp"></i>

                        WhatsApp

                    </div>

                    <button
                        type="button"
                        class="lc-small-action lc-document-action">

                        <i class="bi bi-file-earmark"></i>

                    </button>

                    <button
                        type="button"
                        class="lc-small-action">

                        <i class="bi bi-copy"></i>

                    </button>

                </div>


                <div class="lc-chat-meta">

                    <span class="lc-meta-label">
                        Área:
                    </span>

                    <button
                        type="button"
                        class="lc-area-btn">

                        Sin especificar

                    </button>

                    <button
                        type="button"
                        class="lc-meta-action">

                        <i class="bi bi-tag"></i>
                        Etiquetas

                    </button>

                    <button
                        type="button"
                        class="lc-header-icon">

                        <i class="bi bi-clock-history"></i>

                    </button>

                </div>

            </div>

        </header>


        <!-- =====================================
             MENSAJES
        ====================================== -->
        <div
            class="lc-messages"
            id="lcMessages">


            <!-- FECHA -->
            <div class="lc-date-separator">

                <span>
                    <i class="bi bi-chat-left-text"></i>
                    <i class="bi bi-calendar3"></i>
                    Primera conversación iniciada: Hoy
                </span>

            </div>


            <!-- CLIENTE -->
            <div class="lc-message-row lc-message-customer">

                <div class="lc-message-avatar">
                    AL
                </div>

                <div class="lc-message-stack">

                    <div class="lc-message-sender">
                        ale
                    </div>

                    <div class="lc-message-bubble">

                        <div>
                            Termotanque eléctrico 50 litros
                        </div>

                        <span class="lc-message-time">
                            18:37
                        </span>

                    </div>

                    <div class="lc-message-bubble lc-small-bubble">

                        <div>
                            Carga súper
                        </div>

                        <span class="lc-message-time">
                            18:37
                        </span>

                    </div>

                    <div class="lc-message-bubble lc-tiny-bubble">

                        <div>?</div>

                        <span class="lc-message-time">
                            18:37
                        </span>

                    </div>

                </div>

            </div>


            <!-- TOOL CALL -->
            <div class="lc-tool-event">

                <div class="lc-tool-header">

                    <span>
                        <i class="bi bi-wrench-adjustable"></i>
                        Tío Musa IA · 6 oct, 18:37
                    </span>

                    <span class="lc-tool-badge">
                        TOOL CALL
                    </span>

                </div>

                <div class="lc-tool-name">
                    search_products
                </div>

            </div>


            <button
                type="button"
                class="lc-show-events">

                <i class="bi bi-layers"></i>
                Mostrar 1 evento más

            </button>


            <!-- ASISTENTE -->
            <div class="lc-message-row lc-message-assistant">

                <div class="lc-assistant-bubble">

                    <div class="lc-assistant-header">

                        <span>
                            <i class="bi bi-robot"></i>
                            Asistente
                        </span>

                    </div>

                    <div class="lc-assistant-text">

                        Tengo este que te puede servir, es de carga
                        superior como buscabas:

                        <br><br>

                        <em>
                            Termotanque Eléctrico Señorial
                            Tesz-65 Zafiro Blanco 50 Litros Superior
                        </em>

                        <br>

                        Precio de contado online: $ 342.000

                        <br>

                        Podés pagarlo en hasta 24 cuotas fijas o en
                        3 sin interés con tarjeta MasterCard.

                        <br><br>

                        Podés buscarlo directamente en nuestra web.

                        <br>

                        ¿Qué te parece?

                    </div>

                    <div class="lc-assistant-footer">

                        <span>18:38</span>

                        <i class="bi bi-check2-all"></i>

                        <i class="bi bi-braces"></i>

                    </div>

                </div>

                <div class="lc-message-avatar lc-ai-avatar">
                    AI
                </div>

            </div>

        </div>


        <!-- =====================================
             COMPOSER
        ====================================== -->
        <footer class="lc-composer">

            <button
                type="button"
                class="lc-add-btn">

                <i class="bi bi-plus-lg"></i>

            </button>


            <div class="lc-input-wrapper">

                <textarea
                    id="lcMessageInput"
                    rows="1"
                    placeholder='Escribe un mensaje, "/" para respuestas rápidas, ":" para emojis o "--" para notas'></textarea>

                <button
                    type="button"
                    class="lc-emoji-btn">

                    <i class="bi bi-emoji-smile"></i>

                </button>

            </div>


            <button
                type="button"
                class="lc-send-btn"
                id="lcSendButton">

                <i class="bi bi-mic"></i>

            </button>

        </footer>

    </section>

</div>