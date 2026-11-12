<%@ page contentType="text/html;charset=UTF-8" language="java" %>
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
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>TMChatBot | Iniciar sesión</title>
        <link rel="icon" href="<%= ctx%>/assets/tmchatbot-favicon.ico">
        <link rel="stylesheet" href="<%= ctx%>/css/tm-login.css?v=2">
    </head>
    <body class="tm-login-page">
        <main class="tm-login-layout">
            <section class="tm-hero" aria-label="TMChatBot, plataforma de conversaciones">
                <div class="tm-hero-art"></div>
                <div class="tm-hero-overlay"></div>
                <div class="tm-hero-brand"><span class="tm-hero-kicker">TU CENTRO DE CONVERSACIONES</span><h1>Conversaciones<br><em>más inteligentes.</em></h1><p>Atención humana e inteligencia artificial, conectadas en un solo lugar.</p></div>
                <div class="tm-hero-footer"><span class="tm-status-dot"></span> TMChatBot · Tío Musa IA</div>
            </section>
            <section class="tm-form-area">
                <div class="tm-decor tm-decor-one"></div><div class="tm-decor tm-decor-two"></div>
                <div class="tm-dots" aria-hidden="true"></div>
                <div class="tm-login-card">
                    <header class="tm-card-brand">
                        <img class="tm-brand-logo" src="<%= ctx%>/assets/tmchatbot-logo.png" alt="Robot TMChatBot">
                        <div class="tm-brand-name"><span>TM</span>ChatBot</div>
                    </header>
                    <div class="tm-intro"><h2>Bienvenido</h2><p>Ingresá a TMChatBot para gestionar<br class="tm-desktop-only"> tus conversaciones.</p></div>
                    <!-- Cambiar action por el servlet real de autenticación. -->
                    <form id="tmLoginForm" method="post" action="<%= ctx%>/Login" autocomplete="on">
                        <label class="tm-field"><span class="tm-sr-only">Usuario</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg><input id="Username" name="usuario" type="text" placeholder="Usuario" autocomplete="username" required></label>
                        <label class="tm-field"><span class="tm-sr-only">Contraseña</span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input id="Password" name="password" type="password" placeholder="Contraseña" autocomplete="current-password" required><button class="tm-eye" type="button" id="tmTogglePassword" aria-label="Mostrar contraseña"><svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button></label>
                        <div class="tm-form-options"><label class="tm-remember"><input type="checkbox" name="recordarme"><span>Recordarme</span></label><a href="#" id="tmForgot">¿Olvidaste tu contraseña?</a></div>
                        <button id="submitBtn" type="submit" class="tm-submit">Ingresar <span aria-hidden="true">→</span></button>
                    </form>
                    <div class="tm-card-separator"><span></span><i>✦</i><span></span></div>
                    <footer class="tm-card-footer"><strong>TMChatBot</strong> &nbsp; | &nbsp; Tío Musa IA<br><small>© 2026. Todos los derechos reservados.</small></footer>
                </div>
            </section>
        </main>
        <div id="mfa-overlay"
             class="tm-mfa-overlay"
             style="display:none;"
             role="dialog"
             aria-modal="true"
             aria-labelledby="tmMfaTitle">

            <div class="tm-mfa-modal">

                <div class="tm-mfa-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="5" y="10" width="14" height="11" rx="2"/>
                    <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                    </svg>
                </div>

                <div class="tm-mfa-header">
                    <span class="tm-mfa-kicker">
                        VERIFICACIÓN DE SEGURIDAD
                    </span>

                    <h3 id="tmMfaTitle">
                        Autenticación requerida
                    </h3>

                    <p>
                        Ingresá el código de 6 dígitos generado
                        por Google Authenticator.
                    </p>
                </div>

                <div class="tm-mfa-code-wrapper">
                    <input
                        type="text"
                        id="mfa-code"
                        class="tm-mfa-code"
                        placeholder="000000"
                        maxlength="6"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        autocomplete="one-time-code">
                </div>

                <div id="tmMfaError"
                     class="tm-mfa-error"
                     style="display:none;">
                    El código ingresado no es válido.
                </div>

                <div class="tm-mfa-actions">

                    <button
                        id="btnCloseMfa"
                        type="button"
                        class="tm-mfa-cancel">
                        Cancelar
                    </button>

                    <button
                        id="btnConfirmMfa"
                        type="button"
                        class="tm-mfa-confirm">
                        Validar código
                        <span aria-hidden="true">→</span>
                    </button>

                </div>

                <div class="tm-mfa-footer">
                    <span class="tm-mfa-security-dot"></span>
                    Acceso protegido por verificación en dos pasos
                </div>

            </div>
        </div>
        <div id="modalCambioPassword" class="tm-password-overlay"
             role="dialog" aria-modal="true"
             aria-labelledby="tituloCambioPassword" hidden>

            <div class="tm-password-modal">

                <div class="tm-password-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>

                <h2 id="tituloCambioPassword">
                    Actualizá tu contraseña
                </h2>

                <p class="tm-password-description">
                    Por seguridad, necesitás establecer una contraseña
                    definitiva antes de acceder al sistema.
                </p>

                <form id="formCambioPassword">

                    <label for="passwordNueva">
                        Nueva contraseña
                    </label>

                    <input type="password"
                           id="passwordNueva"
                           autocomplete="new-password"
                           minlength="12"
                           maxlength="128"
                           required>

                    <label for="passwordConfirmar">
                        Confirmar contraseña
                    </label>

                    <input type="password"
                           id="passwordConfirmar"
                           autocomplete="new-password"
                           minlength="12"
                           maxlength="128"
                           required>

                    <div id="errorCambioPassword"
                         class="tm-password-error"
                         role="alert"></div>

                    <button type="submit"
                            id="btnGuardarPassword"
                            class="tm-password-submit">
                        Guardar contraseña
                    </button>

                </form>

            </div>
        </div>
        <script src="js/jquery.js"></script>
        <script>
            let passwordTemporalPendiente = null;
            let usuarioPendiente = null;
            const mfaInput = document.getElementById("mfa-code");

            mfaInput.addEventListener("input", function () {

                // Aceptar únicamente números
                this.value = this.value.replace(/\D/g, "").slice(0, 6);

                if (this.value.length === 6) {
                    document.getElementById("btnConfirmMfa").focus();
                }
            });
            function procesarRespuestaLogin(response, username, password) {

                if (!response.success) {
                    alert(response.message || "Credenciales inválidas");
                    return;
                }

                // Compatible con ambos formatos:
                // { success: true, requireMfa: true }
                // { success: true, data: { requireMfa: true } }
                const data = response.data &&
                        typeof response.data === "object"
                        ? response.data
                        : response;

                if (data.ChangePassword === true) {
                    usuarioPendiente = username;
                    passwordTemporalPendiente = password;

                    abrirModalCambioPassword();
                    return;
                }

                if (data.requireMfa === true) {
                    abrirModalMFA();
                    return;
                }

                document.getElementById("Password").value = "";

                window.location.href =
                        '${pageContext.request.contextPath}/verificarToken';
            }
            function abrirModalCambioPassword() {
                document.getElementById("modalCambioPassword").hidden = false;
                document.getElementById("passwordNueva").focus();
            }

            function cerrarModalCambioPassword() {
                document.getElementById("modalCambioPassword").hidden = true;

                passwordTemporalPendiente = null;
                usuarioPendiente = null;

                document.getElementById("formCambioPassword").reset();
            }

            $("#formCambioPassword").on("submit", async function (e) {
                e.preventDefault();

                const nueva = $("#passwordNueva").val();
                const confirmar = $("#passwordConfirmar").val();
                const $error = $("#errorCambioPassword");
                const $boton = $("#btnGuardarPassword");

                $error.text("");

                if (nueva.length < 12 || nueva.length > 128) {
                    $error.text("La contraseña debe tener entre 12 y 128 caracteres.");
                    return;
                }

                if (nueva !== confirmar) {
                    $error.text("Las contraseñas no coinciden.");
                    return;
                }

                if (nueva === passwordTemporalPendiente) {
                    $error.text("La nueva contraseña debe ser diferente a la temporal.");
                    return;
                }

                $boton.prop("disabled", true);

                try {
                    const response = await $.ajax({
                        url: "ProcesoDatos",
                        method: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify({
                            Accion: "CambiarPasswordInicial",
                            Parametro1: usuarioPendiente,
                            Parametro3: passwordTemporalPendiente,
                            Parametro2: nueva
                        })
                    });

                    if (response.usuario !== usuarioPendiente) {
                        $error.text(
                                response.message || "No se pudo actualizar la contraseña."
                                );
                        return;
                    }

                    cerrarModalCambioPassword();

                    alert("Contraseña actualizada. Iniciá sesión nuevamente.");

                } catch (error) {
                    $error.text("No se pudo completar la solicitud.");
                } finally {
                    $boton.prop("disabled", false);
                }
            });
            function abrirModalMFA() {
                const overlay = document.getElementById("mfa-overlay");
                const input = document.getElementById("mfa-code");
                const error = document.getElementById("tmMfaError");

                input.value = "";
                error.style.display = "none";

                overlay.style.display = "flex";

                requestAnimationFrame(() => {
                    input.focus();
                });
            }
            async function login() {
                var username = document.getElementById('Username').value;
                var password = document.getElementById('Password').value;

                const response =
                        await fetch('${pageContext.request.contextPath}/Login', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: 'userN=' + encodeURIComponent(username) + '&passW=' + encodeURIComponent(password) + '&type=' + encodeURIComponent('login')
                        });
                const data = await response.json();

                procesarRespuestaLogin(data, username, password);
            }
            async function forgot(user) {
                try {
                    const response =
                            await fetch("${pageContext.request.contextPath}/ForgotPassword", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    UserName: user,
                                    Sistema: "tmchatbot"
                                })
                            }
                            );


                    const data =
                            await response.json();


                    if (!response.ok ||
                            !data.success) {

                        alert(
                                data.message ||
                                "No se pudo cambiar la contraseña."
                                );

                        return;
                    }
                    alert(data.message);
                } catch (error) {

                    console.error(error);

                    alert(
                            "No se pudo conectar con el servidor."
                            );

                }
            }

            document.getElementById("btnCloseMfa").addEventListener("click", () => {
                document.getElementById("mfa-overlay")
                        .style.display = "none";
            });
            document.getElementById('submitBtn').addEventListener('click', function (event) {
                event.preventDefault();
                login();
            });
            document.getElementById("btnConfirmMfa").addEventListener('click', function (event) {
                event.preventDefault();
                var username = document.getElementById('Username').value;
                let code = document.getElementById("mfa-code").value;

                // Realiza la solicitud POST usando fetch
                fetch('${pageContext.request.contextPath}/Login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'userN=' + encodeURIComponent(username) + '&passW=' + encodeURIComponent(code) + '&type=' + encodeURIComponent('code')
                })
                        .then(response => response.json()) // Manejo de la respuesta
                        .then(data => {
                            if (data.success && !data.requireMfa) {
                                console.log("ok");
                                document.getElementById('Username').value = '';
                                document.getElementById('Password').value = '';
                                window.location.href = '${pageContext.request.contextPath}/verificarToken'; // Redirecciona si el login es exitoso
                                return;
                            }
                            alert('Error en la solicitud: Credenciales invalidas');
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Error en la solicitud: ' + error.message);
                        });
            });
            document.getElementById('tmTogglePassword').addEventListener('click', function () {
                const input = document.getElementById('Password');
                const show = input.type === 'password';
                input.type = show ? 'text' : 'password';
                this.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
            });
            document.getElementById('tmForgot').addEventListener('click', function (e) {
                e.preventDefault();
                var username = document.getElementById('Username').value;
                forgot(username);
            });
        </script>
    </body>
</html>
