
package com.tmchatbot;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 *
 * @author Usuario
 */
@WebServlet(name = "ProcesoDatosChat", urlPatterns = {"/ProcesoDatosChat"})
public class ProcesoDatosChat extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)  throws ServletException, IOException {
        String token = getToken.token(request);
        if (token == null ||
            token.trim().isEmpty()) {
            response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED
            );
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write( "{\"error\":\"TokenVencido\"}" );
            return;
        }
        String body = leerBody(request);
        System.out.println(
            "LiveChat request: " + body
        );
        try {
            JSONObject json =  new JSONObject(body);
            String accion = json.optString( "Accion", "" );

            ApiResponse apiResponse = procesarAccion(accion, json, token);
            response.setStatus(
                apiResponse.status
            );
            response.setContentType(
                "application/json;charset=UTF-8"
            );
            response.setCharacterEncoding(
                "UTF-8"
            );
            response.getWriter().write(
                apiResponse.body
            );
        } catch (Exception ex) {
            ex.printStackTrace();
            response.setStatus(
                HttpServletResponse
                    .SC_INTERNAL_SERVER_ERROR
            );
            response.setContentType(
                "application/json;charset=UTF-8"
            );
            JSONObject error =new JSONObject();
            error.put( "error", ex.getMessage());
            response.getWriter().write(
                error.toString()
            );
        }
    }
    private String leerBody(HttpServletRequest request)throws IOException {
        StringBuilder body =new StringBuilder();
        try (
            BufferedReader reader =
                new BufferedReader(
                    new InputStreamReader(
                        request.getInputStream(),
                        StandardCharsets.UTF_8
                    )
                )
        ) {

            String line;


            while (
                (line = reader.readLine())
                    != null
            ) {

                body.append(line);
            }
        }


        return body.toString();
    }
    private ApiResponse procesarAccion(String accion,JSONObject json,String token)throws IOException {
        switch (accion) {
            // ==========================
            // CONVERSACIONES
            // ==========================
            case "GetLiveChatConversations":  
                String channelCode = json.optString("Parametro1");
                if (!"WHATSAPP".equals(channelCode) &&
                    !"MERCADO_LIBRE".equals(channelCode)) {
                    return new ApiResponse(
                        HttpServletResponse.SC_BAD_REQUEST,
                        "{\"error\":\"Canal inválido\"}"
                    );
                }
                return enviarSolicitud("GET", urlstatic.LIVECHAT_URL + "/conversations/"+channelCode, token, null);
            // ==========================
            // TAKE CONVERSACIONES
            // ==========================
            case "TakeConversation":
                long conversationIdt =json.getLong("Parametro1");
                return enviarSolicitud("POST", urlstatic.LIVECHAT_URL + "/conversations/"+conversationIdt+"/take", token, null);
            // ==========================
            // MENSAJES
            // ==========================
            case "GetLiveChatMessages":
                long conversationId =json.getLong("Parametro1");
                String beforeId =json.optString("Parametro2","");
                int limit =json.optInt("Parametro3",30);
                StringBuilder url = new StringBuilder();
                url.append(
                    urlstatic.LIVECHAT_URL
                );
                url.append("/conversations/");
                url.append(conversationId);
                url.append("/messages?limit=");
                url.append(limit);
                if (
                    beforeId != null &&
                    !beforeId.trim().isEmpty()
                ) {

                    url.append(
                        "&beforeId="
                    );

                    url.append(
                        beforeId
                    );
                }
                return enviarSolicitud("GET",url.toString(),token, null);
            // ==========================
            // ASIGNACIÓN
            // ==========================
            case "ChangeLiveChatAssignment":
                long assignmentConversationId =json.getLong("Parametro1");
                JSONObject assignment =json.getJSONObject("Data");
                return enviarSolicitud("PUT", urlstatic.LIVECHAT_URL +"/conversations/" +assignmentConversationId + "/assignment",
                    token,assignment.toString());
            // ==========================
            // Devolvier a IA
            // ==========================    
            case "ReturnConversationToAI":
                long returnConversationId = json.getLong("Parametro1");
                return enviarSolicitud("POST",urlstatic.LIVECHAT_URL + "/conversations/" + returnConversationId + "/return-ai",token,null); 
                
            case "MarkLiveChatRead":
                long conversationId2 = json.getLong("Parametro1");
                String url2 =urlstatic.LIVECHAT_URL  + "/conversations/" +
                    conversationId2 + "/read";
                return enviarSolicitud("PUT",url2,token, "{}");                
            default:
                return new ApiResponse( HttpServletResponse.SC_BAD_REQUEST, "{\"error\":\"Accion no reconocida\"}");
        }
    }
    private ApiResponse enviarSolicitud(String method, String urlString,String token,String body) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection conn =(HttpURLConnection)url.openConnection();
        conn.setRequestMethod( method);
        conn.setRequestProperty(
            "Authorization",
            "Bearer " + token
        );
        conn.setRequestProperty(
            "Accept",
            "application/json"
        );
        /*
         * Solamente enviamos body
         * cuando corresponde.
         */
        if ( body != null && !body.isEmpty()) {
            conn.setRequestProperty(
                "Content-Type",
                "application/json; charset=UTF-8"
            );
            conn.setDoOutput(true);
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input =
                    body.getBytes(
                        StandardCharsets.UTF_8
                    );
                os.write(
                    input,
                    0,
                    input.length
                );
            }
        }
        int status = conn.getResponseCode();
        InputStream stream;
        if (status >= 200 &&  status < 300 ) {
            stream =  conn.getInputStream();
        } else {
            stream =conn.getErrorStream();
        }
        StringBuilder result =new StringBuilder();
        if (stream != null) {
            try (BufferedReader br =new BufferedReader(new InputStreamReader( stream,StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) {
                    result.append(line);
                }
            }
        }
        conn.disconnect();
        return new ApiResponse(
            status,
            result.toString()
        );
    }
    private static class ApiResponse {
        private final int status;
        private final String body;
        public ApiResponse(
                int status,
                String body) {

            this.status =
                status;

            this.body =
                body;
        }
    }
}


