<%@ page contentType="text/html" pageEncoding="UTF-8" language="java"%>
<%@ page import="javax.servlet.http.HttpSession"%>
<%@ page import="java.text.SimpleDateFormat" %>
<% String ctx = request.getContextPath(); %>
<%
    HttpSession sessio = request.getSession(false);
    String rolx = (sessio != null) ? (String) sessio.getAttribute("rol") : null;
    String version = new SimpleDateFormat("yyyy-MMddHHmmss").format(new java.util.Date());
%>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gestión IA</title>
        <!-- ICONOS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link rel="stylesheet"  href="css/gestion-ia.css?v=<%=version%>">
        <link rel="stylesheet" href="css/metrics.css?v=<%=version%>">
        <link rel="icon" href="<%= ctx%>/assets/tmchatbot-favicon.ico">

    </head>

    <body>

        <div class="app" id="app">

            <!-- ======================================================
                 SIDEBAR IZQUIERDO
            ======================================================= -->

            <aside class="sidebar" id="sidebar">

                <!-- HEADER -->

                <div class="sidebar-header">

                    <div class="brand">

                        <i class="bi bi-gear"></i>

                        <span class="sidebar-text">
                            Gestión
                        </span>

                    </div>

                    <button class="icon-btn sidebar-toggle"
                            id="sidebarToggle"
                            title="Contraer menú">

                        <i class="bi bi-layout-sidebar"></i>

                    </button>

                </div>


                <!-- SCROLL SIDEBAR -->

                <div class="sidebar-scroll">

                    <!-- INICIO -->

                    <div class="menu-section">

                        <div class="menu-title sidebar-text">
                            Inicio
                        </div>

                        <a class="menu-item" href="#">
                            <i class="bi bi-grid"></i>
                            <span class="sidebar-text">Ventas</span>
                        </a>

                    </div>


                    <!-- CHATBOT -->

                    <div class="menu-section">

                        <div class="menu-title sidebar-text">
                            Chatbot
                        </div>

                        <a class="menu-item active" href="#" id="chatbotBTN" onclick="showSection('Main', 'chatbotBTN'); return false">
                            <i class="bi bi-robot"></i>
                            <span class="sidebar-text">Chatbot</span>
                        </a>

                        <a class="menu-item" href="#" id="liveChatBTN" onclick="showSection('LiveChat', 'liveChatBTN');return false">
                            <i class="bi bi-chat"></i>
                            <span class="sidebar-text">Livechat</span>
                        </a>

                    </div>


                    <!-- OPERACIONES -->

                    <div class="menu-section">

                        <div class="menu-title sidebar-text">
                            Operaciones
                        </div>

                        <a class="menu-item" href="#">
                            <i class="bi bi-box"></i>
                            <span class="sidebar-text">Productos</span>
                        </a>

                        <a class="menu-item" href="#">
                            <i class="bi bi-bag"></i>
                            <span class="sidebar-text">Órdenes</span>
                        </a>

                        <a class="menu-item" href="#">
                            <i class="bi bi-clipboard"></i>
                            <span class="sidebar-text">Tickets</span>
                        </a>

                    </div>


                    <!-- CRM -->

                    <div class="menu-section">

                        <div class="menu-title sidebar-text">
                            CRM
                        </div>

                        <a class="menu-item" href="#">
                            <i class="bi bi-people"></i>
                            <span class="sidebar-text">Contactos</span>
                        </a>

                        <a class="menu-item" href="#">
                            <i class="bi bi-tag"></i>
                            <span class="sidebar-text">Atributos</span>
                        </a>

                        <a class="menu-item" href="#">
                            <i class="bi bi-megaphone"></i>
                            <span class="sidebar-text">Campañas</span>
                        </a>

                        <a class="menu-item" href="#">
                            <i class="bi bi-bezier2"></i>
                            <span class="sidebar-text">Flujos</span>
                        </a>

                    </div>


                    <!-- ANALÍTICAS -->

                    <div class="menu-section">

                        <div class="menu-title sidebar-text">
                            Analíticas
                        </div>

                        <a class="menu-item" href="#" id="metricsBTN" onclick="showSection('Metrics', 'metricsBTN');return false;">

                            <i class="bi bi-graph-up-arrow"></i>

                            <span class="sidebar-text">
                                Métricas
                            </span>

                            <i class="bi bi-chevron-right
                               menu-arrow
                               sidebar-text"></i>

                        </a>

                    </div>

                </div>


                <!-- FOOTER SIDEBAR -->

                <div class="sidebar-footer">

                    <button class="sidebar-footer-button">

                        <i class="bi bi-headset"></i>

                        <span class="sidebar-text">
                            Soporte
                        </span>

                    </button>


                    <button class="sidebar-footer-button">

                        <i class="bi bi-bug"></i>

                        <span class="sidebar-text">
                            Reportar Problema
                        </span>

                    </button>

                </div>

            </aside>



            <!-- ======================================================
                 ÁREA PRINCIPAL
            ======================================================= -->

            <main class="workspace">

                <!-- ==================================================
                     TOPBAR
                =================================================== -->

                <header class="topbar">

                    <div class="breadcrumbs">

                        <div class="company-icon">
                            <i class="bi bi-building"></i>
                        </div>

                        <span>Tío Musa</span>

                        <i class="bi bi-chevron-down breadcrumb-arrow"></i>

                        <i class="bi bi-chevron-right breadcrumb-separator"></i>                        

                        <div class="tm-channel-dropdown" id="tmChannelDropdown">

                            <button
                                type="button"
                                class="tm-channel-trigger"
                                id="lcChannelSelector"
                                aria-haspopup="true"
                                aria-expanded="false">

                                <span class="tm-channel-icon">
                                    <i class="bi bi-robot"></i>
                                </span>

                                <span class="tm-channel-label">
                                    Tío Musa WhatsApp IA
                                </span>

                                <i class="bi bi-chevron-down tm-channel-chevron"></i>
                            </button>

                            <div class="tm-channel-menu" id="tmChannelMenu">

                                <button
                                    type="button"
                                    class="tm-channel-option active"
                                    data-channel="WHATSAPP">

                                    <span class="tm-channel-option-icon whatsapp">
                                        <i class="bi bi-whatsapp"></i>
                                    </span>

                                    <span class="tm-channel-option-text">
                                        <strong>Tío Musa WhatsApp IA</strong>
                                        <small>Asistente de WhatsApp</small>
                                    </span>

                                    <i class="bi bi-check2 tm-channel-check"></i>
                                </button>

                                <button
                                    type="button"
                                    class="tm-channel-option"
                                    data-channel="MERCADO_LIBRE">

                                    <span class="tm-channel-option-icon mercadolibre">
                                        <i class="bi bi-bag"></i>
                                    </span>

                                    <span class="tm-channel-option-text">
                                        <strong>Tío Musa ML IA</strong>
                                        <small>Asistente de Mercado Libre</small>
                                    </span>

                                    <i class="bi bi-check2 tm-channel-check"></i>
                                </button>

                            </div>

                        </div>

                        <i class="bi bi-chevron-right breadcrumb-separator"></i>

                        <span>Chatbot</span>

                    </div>


                    <div class="topbar-actions">

                        <button class="top-icon">
                            <i class="bi bi-book"></i>
                        </button>

                        <button class="top-icon">
                            <i class="bi bi-bell"></i>
                        </button>

                        <button class="top-icon">
                            <i class="bi bi-palette"></i>
                        </button>

                        <div class="tm-user-menu" id="tmUserMenu">

                            <button
                                type="button"
                                class="avatar tm-user-trigger"
                                id="tmUserTrigger"
                                aria-label="Menú de usuario"
                                aria-expanded="false"
                                aria-controls="tmUserDropdown">

                                <i class="bi bi-person-fill"></i>

                            </button>

                            <div
                                class="tm-user-dropdown"
                                id="tmUserDropdown"
                                hidden>

                                <form
                                    action="<%= request.getContextPath()%>/Logout"
                                    method="POST"
                                    onsubmit="
                                             if (typeof stopLiveChatHeartbeat === 'function') {
                                                 stopLiveChatHeartbeat();
                                             }
                                    ">

                                    <button
                                        type="submit"
                                        class="tm-logout-button">

                                        <i class="bi bi-box-arrow-right"></i>
                                        Cerrar sesión

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                </header>


                <!-- ==================================================
                     CONTENIDO CENTRAL + CHAT
                =================================================== -->

                <div class="views-container">
                    <div id="Main" class="content">
                        <%@ include file="jsp/Main.jsp" %>
                    </div>

                    <div id="LiveChat" class="content">
                        <%@ include file="jsp/LiveChat.jsp" %>
                    </div>
                    <div id="Metrics" class="content">
                        <%@ include file="jsp/Metrics.jsp" %>
                    </div>



                </div>

            </main>
        </div>
        <script>var contextPath = '<%= request.getContextPath()%>';</script>
        <script src="js/prompt.js?v=<%=version%>"></script>
        <script src="js/livechat.js?v=<%=version%>"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
        <script src="js/metrics.js?v=<%=version%>"></script>
        <script src="js/gestion-ia.js?v=<%=version%>"></script>
        <script>
            let currentSection = null;
            let changingSection = false;
            let itemButtonPressed = null;
            async function initSection(sectionId) {

                console.log(
                        "Inicializando:",
                        sectionId
                        );

                switch (sectionId) {
                    case "Metrics":
                        await initMetrics();
                        break;

                    case "Main":

                        await showChatbot();

                        break;

                    case "LiveChat":

                        // más adelante
                        await loadLiveChat();


                        break;
                }
            }
            function getCookie(name) {
                const cookies = document.cookie.split(";");

                for (const cookie of cookies) {
                    const [key, ...value] = cookie.trim().split("=");
                    if (key === name) {
                        return value.join("=");
                    }
                }

                return null;
            }
            async function showSection(sectionId, buttonPress) {
                if (changingSection)
                    return;

                const newSection =
                        document.getElementById(sectionId);

                if (!newSection) {
                    console.error(
                            "No existe la sección:",
                            sectionId
                            );
                    return;
                }

                // Ya está visible
                if (newSection.classList.contains("active"))
                    return;

                changingSection = true;

                try {

                    // ==============================
                    // SACAR ACTIVE DE TODAS
                    // ==============================

                    document
                            .querySelectorAll(".views-container > .content")
                            .forEach(section => {

                                if (section !== newSection) {
                                    section.classList.remove("active");
                                }

                            });
                    document.querySelectorAll(".menu-item")
                            .forEach(buttonP => {
                                buttonP.classList.remove("active");

                            });
                    document.getElementById(buttonPress).classList.add("active");
                    /*
                     * Dejamos que el navegador pinte
                     * el estado oculto.
                     */
                    await new Promise(resolve =>
                        requestAnimationFrame(resolve)
                    );

                    // ==============================
                    // ACTIVAR NUEVA
                    // ==============================

                    newSection.classList.add("active");

                    currentSection = newSection;

                    // ==============================
                    // INICIALIZAR CONTENIDO
                    // ==============================

                    await initSection(sectionId);

                } catch (error) {

                    console.error(
                            "Error cambiando sección:",
                            error
                            );

                } finally {

                    changingSection = false;
                }
            }
            document.addEventListener("DOMContentLoaded", async () => {

                console.log(document.cookie);

                const rol = getCookie("rol");

                console.log("rol:", rol);

                currentSection = null;
                initializeChannelSelector();
                await showSection("Main", 'chatbotBTN');
                await connectLiveChat();

                const trigger = document.getElementById("tmUserTrigger");

                const dropdown = document.getElementById("tmUserDropdown");

                if (!trigger || !dropdown)
                    return;

                trigger.addEventListener("click", event => {
                    event.stopPropagation();

                    dropdown.hidden = !dropdown.hidden;

                    trigger.setAttribute(
                            "aria-expanded",
                            String(!dropdown.hidden)
                            );
                });

                document.addEventListener("click", event => {
                    if (!event.target.closest("#tmUserMenu")) {
                        dropdown.hidden = true;
                        trigger.setAttribute("aria-expanded", "false");
                    }
                });

                document.addEventListener("keydown", event => {
                    if (event.key === "Escape") {
                        dropdown.hidden = true;
                        trigger.setAttribute("aria-expanded", "false");
                    }
                });

            });
        </script>
    </body>
</html>
