package com.tmchatbot;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

@WebServlet(
        name = "LiveChatToken",
        urlPatterns = {"/livechat/token"}
)
public class LiveChatToken extends HttpServlet {

    private LiveChatTokenService tokenService;

    @Override
    public void init() throws ServletException {

        try {

            String privateKeyPath
                    = "C:\\Security\\chat-private.pem";

            tokenService
                    = new LiveChatTokenService(privateKeyPath);

        } catch (Exception e) {

            throw new ServletException(
                    "No se pudo cargar la clave privada WebChat",
                    e);
        }
    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType(
                "application/json;charset=UTF-8"
        );

        response.setHeader("Cache-Control", "no-store");

        try {

            // Validar y renovar el Access Token si corresponde.
            String accessToken
                    = AuthSessionManager.getValidAccessToken(request);

            // Recuperar identidad desde la misma sesión.
            AuthSessionData auth
                    = AuthSessionManager.getSessionData(request);

            String username = auth.getUsername();

            if (username == null || username.trim().isEmpty()) {
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED
                );
                return;
            }

            String jwt = tokenService.generateToken(
                    username,
                    "COMPANY_AI_LIVE_CHAT",
                    "LIVE_CHAT"
            );

            JSONObject result = new JSONObject()
                    .put("success", true)
                    .put("token", jwt);

            response.getWriter().write(result.toString());

        } catch (AuthSessionManager.SessionExpiredException ex) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    new JSONObject()
                            .put("success", false)
                            .put("message", "Sesión vencida")
                            .toString()
            );

        } catch (IOException ex) {

            getServletContext().log(
                    "Error validando sesión WebSocket", ex
            );

            response.setStatus(
                    HttpServletResponse.SC_SERVICE_UNAVAILABLE
            );

            response.getWriter().write(
                    new JSONObject()
                            .put("success", false)
                            .put("message",
                                    "Error temporal de autenticación")
                            .toString()
            );
        }
    }

}
