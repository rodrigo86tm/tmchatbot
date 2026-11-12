
package com.tmchatbot;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(
    name = "LiveChatMedia",
    urlPatterns = {"/LiveChatMedia"}
)
public class LiveChatMedia extends HttpServlet {

    private static final long MAX_MEDIA_BYTES =
            16L * 1024 * 1024;

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {

        response.setHeader(
                "Cache-Control", "private, no-store");

        response.setHeader(
                "X-Content-Type-Options", "nosniff");

        // 1. Recuperar token de la cookie.
        String token = getToken.token(request);

        if (token == null || token.trim().isEmpty()) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 2. Validar el ID.
        String idText = request.getParameter("id");
        long attachmentId;

        try {
            attachmentId = Long.parseLong(idText);

            if (attachmentId <= 0) {
                throw new NumberFormatException();
            }

        } catch (NumberFormatException ex) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "ID de archivo inválido");
            return;
        }

        // 3. Consultar la API .NET.
        String apiUrl =
                urlstatic.LIVECHAT_URL
                + "/attachments/"
                + attachmentId
                + "/content";

        HttpURLConnection conn = null;

        try {
            conn = (HttpURLConnection)
                    new URL(apiUrl).openConnection();

            conn.setRequestMethod("GET");

            conn.setConnectTimeout(10000);
            conn.setReadTimeout(30000);

            conn.setRequestProperty(
                    "Authorization",
                    "Bearer " + token);

            conn.setRequestProperty(
                    "Accept",
                    "image/*, audio/*");

            int status = conn.getResponseCode();

            if (status != HttpServletResponse.SC_OK) {

                if (status == 401 || status == 403
                        || status == 404) {
                    response.sendError(status);
                } else {
                    response.sendError(
                            HttpServletResponse
                                    .SC_BAD_GATEWAY);
                }

                return;
            }

            // 4. Validar tipo de contenido.
            String mimeType = conn.getContentType();

            if (mimeType != null) {
                mimeType = mimeType.split(";")[0]
                        .trim().toLowerCase();
            }

            boolean allowed =
                    "image/jpeg".equals(mimeType)
                    || "image/png".equals(mimeType)
                    || "image/webp".equals(mimeType)
                    || "audio/ogg".equals(mimeType)
                    || "audio/mpeg".equals(mimeType)
                    || "audio/mp4".equals(mimeType)
                    || "audio/aac".equals(mimeType)
                    || "audio/amr".equals(mimeType);

            if (!allowed) {
                response.sendError(
                        HttpServletResponse
                                .SC_UNSUPPORTED_MEDIA_TYPE);
                return;
            }

            long contentLength = conn.getContentLengthLong();

            if (contentLength > MAX_MEDIA_BYTES) {
                response.sendError(413);
                return;
            }

            // 5. Transmitir el archivo.
            response.setContentType(mimeType);

            if (contentLength >= 0) {
                response.setContentLengthLong(
                        contentLength);
            }

            try (
                InputStream input = conn.getInputStream();
                OutputStream output =
                        response.getOutputStream()
            ) {
                byte[] buffer = new byte[8192];
                long total = 0;
                int read;

                while ((read = input.read(buffer)) != -1) {

                    total += read;

                    if (total > MAX_MEDIA_BYTES) {
                        throw new IOException(
                                "Archivo excede tamaño permitido");
                    }

                    output.write(buffer, 0, read);
                }

                output.flush();
            }

        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }
}
