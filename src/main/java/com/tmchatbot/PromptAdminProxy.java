package com.tmchatbot;

import java.io.*;
import java.net.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "PromptAdminProxy", urlPatterns = "/PromptAdminProxy/*")
public class PromptAdminProxy extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException {
        String token = getToken.token(req);
        if (token == null || token.trim().isEmpty()) {
            res.sendError(401, "Sesión vencida");
            return;
        }
        String path = req.getPathInfo();
        if (path == null || !path.matches("/[a-zA-Z0-9/_-]+")) {
            res.sendError(400);
            return;
        }
        String method = req.getMethod();
        if (!method.equals("GET") && !method.equals("POST") && !method.equals("PUT") && !method.equals("DELETE")) {
            res.sendError(405);
            return;
        }
        // urlstatic.url termina en /api/ApiTM/; tomamos el host y puerto configurados.
        URL apiBase = new URL(urlstatic.urlBase);
        URL target = new URL(apiBase.getProtocol(), apiBase.getHost(), apiBase.getPort(), "/api/admin/prompt-management" + path);
        HttpURLConnection conn = (HttpURLConnection) target.openConnection();
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(30000);
        conn.setRequestMethod(method);
        conn.setRequestProperty("Authorization", "Bearer " + token);
        conn.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
        if (method.equals("POST") || method.equals("PUT")) {
            conn.setDoOutput(true);
            try (InputStream in = req.getInputStream(); OutputStream out = conn.getOutputStream()) {
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) != -1) {
                    out.write(buf, 0, n);
                }
            }
        }
        int status = conn.getResponseCode();
        res.setStatus(status);
        res.setContentType("application/json;charset=UTF-8");
        InputStream stream = status < 400 ? conn.getInputStream() : conn.getErrorStream();
        if (stream != null) try (InputStream in = stream; OutputStream out = res.getOutputStream()) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) != -1) {
                out.write(buf, 0, n);
            }
        }
        conn.disconnect();
    }
}
