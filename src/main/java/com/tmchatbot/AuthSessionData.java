
package com.tmchatbot;
import java.io.Serializable;

public final class AuthSessionData implements Serializable {

    private static final long serialVersionUID = 1L;

    private String username;
    private String role;
    private String branch;

    private String accessToken;
    private String refreshToken;

    private String accessExpiresAtUtc;
    private String refreshExpiresAtUtc;

    public AuthSessionData(
            String username,
            String role,
            String branch,
            String accessToken,
            String refreshToken,
            String accessExpiresAtUtc,
            String refreshExpiresAtUtc) {

        this.username = username;
        this.role = role;
        this.branch = branch;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.accessExpiresAtUtc = accessExpiresAtUtc;
        this.refreshExpiresAtUtc = refreshExpiresAtUtc;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getBranch() {
        return branch;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getAccessExpiresAtUtc() {
        return accessExpiresAtUtc;
    }

    public String getRefreshExpiresAtUtc() {
        return refreshExpiresAtUtc;
    }

    public void updateTokens(
            String access,
            String refresh,
            String accessExpires,
            String refreshExpires) {

        this.accessToken = access;
        this.refreshToken = refresh;
        this.accessExpiresAtUtc = accessExpires;
        this.refreshExpiresAtUtc = refreshExpires;
    }
}
