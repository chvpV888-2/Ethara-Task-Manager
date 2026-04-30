package com.ethara.taskmanager.util;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component // Tells Spring to create this tool and have it ready for us
public class JwtUtil {

    // This creates an ultra-secret cryptographic key to sign the badges. 
    // If a hacker tries to forge a badge, it will fail because they don't have this key!
    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // The badge expires in 24 hours (86,400,000 milliseconds)
    private final long expirationTime = 86400000; 

    // The method that actually prints the badge
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // We explicitly write their Role (ADMIN/MEMBER) right on the badge!
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey)
                .compact(); // Squishes it all into a secure string
    }
    // NEW: Reads the name off the badge
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // NEW: Checks if the badge is fake or expired
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true; // The badge is valid!
        } catch (Exception e) {
            return false; // The badge is fake or expired!
        }
    }
}