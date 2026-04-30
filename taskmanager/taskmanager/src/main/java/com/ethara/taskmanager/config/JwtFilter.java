package com.ethara.taskmanager.config;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ethara.taskmanager.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        
        // 1. Look for the "Authorization" header in the request
        String authHeader = request.getHeader("Authorization");
        
        // 2. A valid badge always starts with the word "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            
            // 3. Extract the actual scrambled token string
            String token = authHeader.substring(7);
            
            // 4. If the badge is real, tell Spring Security to let them in!
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);
                
                UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // 5. Pass the request along to the next step
        filterChain.doFilter(request, response);
    }
}