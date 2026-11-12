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
        <!-- FILTROS -->
        <div class="lc-filter-row" id="lcFilterRow">

            <button type="button"
                    class="lc-filter-btn lc-filter-active"
                    data-lc-filter="ALL"
                    aria-pressed="true">
                Todos
            </button>

            <button type="button"
                    class="lc-filter-btn"
                    data-lc-filter="AI"
                    aria-pressed="false">
                <i class="bi bi-robot"></i>
                IA
            </button>

            <button type="button"
                    class="lc-filter-btn"
                    data-lc-filter="HUMAN"
                    aria-pressed="false">
                <i class="bi bi-person"></i>
                Humano
            </button>

            <button type="button"
                    class="lc-filter-btn"
                    data-lc-filter="UNREAD"
                    aria-pressed="false">
                <i class="bi bi-chat-square"></i>
                Sin leer
            </button>

            <button type="button"
                    class="lc-filter-btn"
                    data-lc-filter="UNANSWERED"
                    aria-pressed="false">
                <i class="bi bi-chat-left-dots"></i>
                Sin responder
            </button>

            <!-- Mantener el botón de archivadas -->
            <button type="button"
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

                    <div class="lc-contact-name" id="lcContactName">
                        Selecciona una Convesacion

                        <i class="bi bi-robot"></i>
                    </div>

                    <div class="lc-contact-phone" id="lcContactPhone">

                    </div>

                </div>


                <div class="lc-chat-actions">

                    <button
                        type="button"
                        class="lc-convert-btn"
                        id="lcAssignmentButton">

                        <i class="bi bi-person-check"></i>

                        <span id="lcAssignmentText">
                            Tomar conversación
                        </span>

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
        <div id="lcProductContext" class="lc-product-context" hidden></div>
        <div
            class="lc-messages"
            id="lcMessages">
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
                id="lcSendButton"
                title="Enviar mensaje"
                disabled>
                <i class="bi bi-send-fill"></i>
            </button>

        </footer>

    </section>

</div>