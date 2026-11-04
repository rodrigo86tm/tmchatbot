
package com.tmchatbot;

import io.jsonwebtoken.Jwts;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;

import java.util.Base64;
import java.util.Date;
import java.util.UUID;


public class LiveChatTokenService {

    private final PrivateKey privateKey;


    public LiveChatTokenService(
            String privateKeyPath)
            throws Exception {

        this.privateKey =
                loadPrivateKey(
                        privateKeyPath
                );
    }


    private PrivateKey loadPrivateKey(
            String path)
            throws Exception {

        /*
         * Compatible con Java 8.
         */
        byte[] fileBytes =
                Files.readAllBytes(
                        Paths.get(path)
                );


        String pem =
                new String(
                        fileBytes,
                        StandardCharsets.UTF_8
                );


        pem = pem
                .replace(
                        "-----BEGIN PRIVATE KEY-----",
                        ""
                )
                .replace(
                        "-----END PRIVATE KEY-----",
                        ""
                )
                .replaceAll(
                        "\\s+",
                        ""
                );


        byte[] decoded =
                Base64
                        .getDecoder()
                        .decode(pem);


        PKCS8EncodedKeySpec spec =
                new PKCS8EncodedKeySpec(
                        decoded
                );


        KeyFactory factory =
                KeyFactory.getInstance(
                        "RSA"
                );


        return factory.generatePrivate(
                spec
        );
    }


    public String generateToken(  String userId, String audience, String purpose) {

        long now =
                System.currentTimeMillis();

        Date issuedAt =
                new Date(now);

        Date expiration =
                new Date(
                        now +
                        (5 * 60 * 1000)
                );


        return Jwts.builder()
                .setSubject(userId)

                .setIssuer(
                        "TM_WEB_SERVLET"
                )

                .setAudience(
                        audience
                )

                .claim(
                        "purpose",
                        purpose
                )

                .setId(
                        UUID.randomUUID()
                                .toString()
                )

                .setIssuedAt(
                        issuedAt
                )

                .setExpiration(
                        expiration
                )

                .signWith(
                        privateKey,
                        Jwts.SIG.RS256
                )

                .compact();
    }
}


