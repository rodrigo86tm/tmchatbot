
package com.tmchatbot;

public class ApiResponse {
    final int status;
    final String body;

    ApiResponse(int status, String body) {
        this.status = status;
        this.body = body;
    }
}