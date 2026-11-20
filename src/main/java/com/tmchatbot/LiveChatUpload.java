/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package com.tmchatbot;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import javax.servlet.annotation.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "LiveChatUpload", urlPatterns = {"/LiveChatUpload"})
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024,
    maxFileSize = 16 * 1024 * 1024,
    maxRequestSize = 18 * 1024 * 1024
)
public class LiveChatUpload extends HttpServlet {
    @Override protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Cache-Control", "no-store");
        String token = getToken.token(request);
        if (token == null || token.trim().isEmpty()) { response.sendError(401); return; }
        long id;
        try { id = Long.parseLong(request.getParameter("conversationId")); if (id <= 0) throw new Exception(); }
        catch (Exception ex) { response.sendError(400, "Conversación inválida"); return; }
        try {
            Part file = request.getPart("file");
            if (file == null || file.getSize() == 0 || file.getSize() > 16L*1024*1024) { response.sendError(400, "Archivo inválido"); return; }
            String caption = request.getParameter("caption");
            if (caption == null) caption = "";
            String boundary = "----TMChatbot" + java.util.UUID.randomUUID().toString().replace("-", "");
            URL url = new URL(urlstatic.LIVECHAT_URL + "/conversations/" + id + "/attachments");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            try {
                conn.setRequestMethod("POST"); conn.setDoOutput(true);
                conn.setConnectTimeout(15000); conn.setReadTimeout(120000);
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
                try (OutputStream out = conn.getOutputStream()) {
                    out.write(("--"+boundary+"\r\nContent-Disposition: form-data; name=\"caption\"\r\n\r\n"+caption+"\r\n").getBytes(StandardCharsets.UTF_8));
                    String filename = file.getSubmittedFileName().replace("\"", "_").replace("\r", "_").replace("\n", "_");
                    out.write(("--"+boundary+"\r\nContent-Disposition: form-data; name=\"file\"; filename=\""+filename+"\"\r\nContent-Type: "+file.getContentType()+"\r\n\r\n").getBytes(StandardCharsets.UTF_8));
                    try (InputStream in = file.getInputStream()) { byte[] buf = new byte[8192]; int n; while ((n=in.read(buf))!=-1) out.write(buf,0,n); }
                    out.write(("\r\n--"+boundary+"--\r\n").getBytes(StandardCharsets.UTF_8));
                }
                int status = conn.getResponseCode(); response.setStatus(status);
                try (InputStream in = status < 400 ? conn.getInputStream() : conn.getErrorStream()) {
                    if (in != null) { byte[] buf = new byte[8192]; int n; while ((n=in.read(buf))!=-1) response.getOutputStream().write(buf,0,n); }
                }
            } finally { conn.disconnect(); }
        } catch (Exception ex) { response.setStatus(502); response.getWriter().write("{\"error\":\"No se pudo enviar el archivo\"}"); getServletContext().log("LiveChatUpload", ex); }
    }
}
