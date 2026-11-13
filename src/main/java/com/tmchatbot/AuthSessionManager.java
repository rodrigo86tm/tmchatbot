package com.tmchatbot;

import java.io.IOException;
import java.time.Instant;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.json.JSONObject;

public final class AuthSessionManager {

    private static final long RENEW_BEFORE_SECONDS = 60;

    private AuthSessionManager() {
    }

    public static String getValidAccessToken(
            HttpServletRequest request) throws IOException {

        HttpSession session = request.getSession(false);

        if (session == null) {
            throw new SessionExpiredException();
        }

        synchronized (session) {

            AuthSessionData auth = (AuthSessionData) session.getAttribute("AUTH_SESSION");

            if (auth == null
                    || auth.getAccessToken() == null
                    || auth.getRefreshToken() == null) {

                throw new SessionExpiredException();
            }

            Instant expiration;

            try {
                expiration = parseInstant(
                        auth.getAccessExpiresAtUtc()
                );
            } catch (Exception ex) {
                throw new IOException(
                        "Vencimiento del Access Token inválido",
                        ex
                );
            }

            Instant renewAt = Instant.now()
                    .plusSeconds(RENEW_BEFORE_SECONDS);

            if (expiration.isAfter(renewAt)) {
                return auth.getAccessToken();
            }

            return refreshLocked(session, auth);
        }
    }

    private static Instant parseInstant(String value) {
        return java.time.OffsetDateTime
                .parse(value)
                .toInstant();
    }

    public static String forceRefresh(
            HttpServletRequest request,
            String rejectedAccessToken) throws IOException {

        HttpSession session = request.getSession(false);

        if (session == null) {
            throw new SessionExpiredException();
        }

        synchronized (session) {

            AuthSessionData auth = (AuthSessionData) session.getAttribute("AUTH_SESSION");

            if (auth == null
                    || auth.getAccessToken() == null
                    || auth.getRefreshToken() == null) {

                throw new SessionExpiredException();
            }

            if (!auth.getAccessToken()
                    .equals(rejectedAccessToken)) {

                return auth.getAccessToken();
            }

            return refreshLocked(session, auth);
        }
    }

    private static String refreshLocked(
            HttpSession session,
            AuthSessionData auth) throws IOException {

        JSONObject body = new JSONObject()
                .put("refreshToken", auth.getRefreshToken());

        JSONObject result;

        try {

            result = AuthApiClient.post(
                    "/refresh",
                    body,
                    null
            );

        } catch (AuthApiClient.AuthApiException ex) {

            if (ex.getStatus() == 400
                    || ex.getStatus() == 401) {

                clearCredentials(session);

                throw new SessionExpiredException();
            }

            throw ex;
        }

        String newAccess
                = result.optString("AccessToken");

        String newRefresh
                = result.optString("RefreshToken");

        String newAccessExpiry
                = result.optString("AccessExpiresAtUtc");

        String newRefreshExpiry
                = result.optString("RefreshExpiresAtUtc");

        if (newAccess.isEmpty()
                || newRefresh.isEmpty()
                || newAccessExpiry.isEmpty()
                || newRefreshExpiry.isEmpty()) {

            throw new IOException(
                    "Respuesta de refresh incompleta"
            );
        }

        try {
            parseInstant(newAccessExpiry);
            parseInstant(newRefreshExpiry);

        } catch (Exception ex) {

            throw new IOException(
                    "Vencimientos inválidos en refresh",
                    ex
            );
        }

        // Actualizamos las credenciales del mismo usuario.
        auth.updateTokens(
                newAccess,
                newRefresh,
                newAccessExpiry,
                newRefreshExpiry
        );

        return newAccess;
    }

    private static void clearCredentials(HttpSession session) {

        session.removeAttribute("AUTH_SESSION");

        // Limpiamos también los atributos anteriores.
        session.removeAttribute("accessToken");
        session.removeAttribute("refreshToken");
        session.removeAttribute("accessExpiresAtUtc");
        session.removeAttribute("refreshExpiresAtUtc");

        session.removeAttribute("profile");
        session.removeAttribute("usuario");
        session.removeAttribute("rol");
        session.removeAttribute("sucursal");
    }

    public static class SessionExpiredException
            extends IOException {

        public SessionExpiredException() {
            super("Sesión vencida o revocada");
        }
    }

    public static AuthSessionData getSessionData(
            HttpServletRequest request) throws IOException {

        HttpSession session = request.getSession(false);

        if (session == null) {
            throw new SessionExpiredException();
        }

        synchronized (session) {

            AuthSessionData auth = (AuthSessionData) session.getAttribute("AUTH_SESSION");

            if (auth == null
                    || auth.getRefreshToken() == null
                    || auth.getRefreshToken().isEmpty()) {

                throw new SessionExpiredException();
            }

            return auth;
        }
    }
}
