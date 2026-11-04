/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package com.tmchatbot;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;

/**
 *
 * @author Usuario
 */
@WebServlet(name = "ForgotPassword", urlPatterns = {"/ForgotPassword"})
public class ForgotPassword extends HttpServlet {
@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
            BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream(), "UTF-8"));
            StringBuilder jsonBody = new StringBuilder();
            String line;
            while((line = reader.readLine()) != null){
                jsonBody.append(line);
            }
            System.out.println("JSON Recibido: " + jsonBody);
            String jsonResponse = enviarSolicitud(jsonBody.toString());
            
            response.setContentType("application/json;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(jsonResponse);      
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
     private String enviarSolicitud(String solicitud) throws IOException{        
        URL url = new URL(urlstatic.url + "forgot-password");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type","application/json");
        
        String jsonInputString = new JSONObject(solicitud).toString();
        
        conn.setDoOutput(true);
        
        try(OutputStream os = conn.getOutputStream()){
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input,0,input.length);
        }
        int statusCode = conn.getResponseCode();
        InputStream stream;
        if(statusCode>=200 && statusCode <=300){
            stream = conn.getInputStream();
        }else{
            stream = conn.getErrorStream();
        }
        try(BufferedReader br = new BufferedReader(new InputStreamReader(stream,"utf-8"))){
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine())!= null){
                response.append(responseLine.trim());
            }
            return response.toString();
        }
    }

}
