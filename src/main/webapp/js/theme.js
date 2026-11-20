/* TMChatbot REV4: tema persistente, sin recargar la pagina */
(function () {
    "use strict";
    const KEY = "tmchatbot.theme";
    function applyTheme(theme) {
        const dark = theme === "dark";
        document.documentElement.dataset.theme = dark ? "dark" : "light";
        document.documentElement.style.colorScheme = dark ? "dark" : "light";
        const button = document.getElementById("tmThemeToggle");
        const icon = document.getElementById("tmThemeIcon");
        if (button) {
            button.setAttribute("aria-pressed", String(dark));
            button.setAttribute("aria-label", dark ? "Activar tema claro" : "Activar tema oscuro");
            button.title = dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
        }
        if (icon) icon.className = dark ? "bi bi-sun" : "bi bi-moon-stars";
    }
    function init() {
        applyTheme(document.documentElement.dataset.theme);
        document.getElementById("tmThemeToggle")?.addEventListener("click", function () {
            const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            try { localStorage.setItem(KEY, next); } catch (_) { /* almacenamiento deshabilitado */ }
            applyTheme(next);
        });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
})();
