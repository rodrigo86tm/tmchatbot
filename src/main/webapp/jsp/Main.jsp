
<div class="content-layout">


            <!-- ==============================================
                 PANEL CENTRAL
            =============================================== -->

            <section class="agent-panel">


                <!-- TOP TABS -->

                <div class="agent-tabs">

                    <button class="agent-tab active">

                        <i class="bi bi-robot"></i>

                        Instrucciones

                    </button>


                    <button class="agent-tab">

                        <i class="bi bi-magic"></i>

                        Herramientas

                        <span class="tab-counter">
                            3
                        </span>

                    </button>


                    <button class="agent-tab">

                        <i class="bi bi-book"></i>

                        Entrenamientos

                        <span class="tab-counter">
                            20
                        </span>

                    </button>


                    <button class="agent-tab">

                        <i class="bi bi-box-seam"></i>

                        Productos

                        <span class="tab-counter">
                            21
                        </span>

                    </button>


                    <button class="agent-tab tab-menu">

                        <i class="bi bi-three-dots-vertical"></i>

                    </button>

                </div>


                <!-- SUB TABS -->

                <div class="sub-tabs">

                    <button class="sub-tab active">
                        General
                    </button>

                    <button class="sub-tab">
                        <i class="bi bi-chat-left"></i>
                        Comentarios
                    </button>

                    <button class="sub-tab">
                        <i class="bi bi-chat"></i>
                        Mensajes Privados
                    </button>

                    <button class="sub-tab">
                        <i class="bi bi-camera"></i>
                        Historias
                    </button>

                    <button class="warning-button">
                        <i class="bi bi-exclamation-circle"></i>
                    </button>

                    <button class="sub-tab selected">
                        <i class="bi bi-list-ul"></i>
                        Secciones
                    </button>

                    <button class="sub-tab">
                        <i class="bi bi-file-earmark-text"></i>
                        Avanzado
                    </button>

                </div>


                <!-- ==========================================
                     SCROLL CENTRAL
                =========================================== -->
                <div class="sections-scroll" id="promptSections">

                    <div class="prompt-loading" id="promptLoading">
                        <div class="spinner-border"></div>
                        <span>Cargando configuración...</span>
                    </div>

                </div>
                

            </section>



            <!-- ==============================================
                 BOTÓN COLAPSAR CHAT
            =============================================== -->

            <button class="chat-collapse"
                    id="chatCollapse"
                    title="Ocultar chat">

                <i class="bi bi-chevron-right"></i>

            </button>



            <!-- ==============================================
                 CHAT DERECHO
            =============================================== -->

            <aside class="test-chat" id="testChat">

                <!-- HEADER -->

                <div class="chat-header">

                    <div class="chat-user">

                        <div class="chat-avatar">
                            T
                        </div>

                        <div>

                            <div class="chat-title">
                                Conversación de Prueba
                            </div>

                            <div class="chat-subtitle">
                                Chatea con Tío Musa IA
                            </div>

                        </div>

                    </div>


                    <button class="source-button">

                        <i class="bi bi-layers"></i>

                        Sin fuente

                        <i class="bi bi-chevron-down"></i>

                    </button>

                </div>


                <!-- MENSAJES -->

                <div class="chat-body" id="chatBody">

                    <div class="empty-chat">

                        <div class="empty-chat-icon">
                            <i class="bi bi-robot"></i>
                        </div>

                        <h3>
                            Inicia una conversación
                        </h3>

                        <p>
                            Comienza a probar tu chatbot enviando
                            un mensaje o agregando mensajes
                            personalizados para simular diferentes
                            escenarios.
                        </p>

                        <button class="add-test-message">

                            <i class="bi bi-plus"></i>

                            Agregar mensaje de prueba

                        </button>

                    </div>

                </div>


                <!-- INPUT -->

                <div class="chat-input-area">

                    <div class="chat-input">

                        <button class="attachment-btn">
                            <i class="bi bi-paperclip"></i>
                        </button>

                        <textarea id="testMessage"
                                  rows="1"
                                  placeholder="Escribe tu mensaje"></textarea>

                        <button class="send-button"
                                id="sendTestMessage">

                            <i class="bi bi-send"></i>

                        </button>

                    </div>

                </div>

            </aside>



            <!-- BOTÓN FLOTANTE ABRIR CHAT -->

            <button class="open-chat-floating"
                    id="openChat"
                    title="Abrir chat de prueba">

                <i class="bi bi-chat-dots"></i>

            </button>


        </div>