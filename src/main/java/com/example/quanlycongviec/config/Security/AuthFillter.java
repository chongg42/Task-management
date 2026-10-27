package com.example.quanlycongviec.config.Security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.quanlycongviec.Service.JWTService;
import com.example.quanlycongviec.Service.UserDetailServiceCustomize;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component 
@RequiredArgsConstructor 
@Slf4j 
public class AuthFillter extends OncePerRequestFilter {

    private final JwtDecoderConfig jwtDecoder;
    private final JWTService jwtService;
    private final UserDetailServiceCustomize userDetailServiceCustomize;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {

        String jwt = null;

        // Bỏ qua lọc JWT cho các API Auth công khai
        if (request.getServletPath().contains("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 1. Lấy token từ Header Authorization
        final String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        } 
        // 2. Nếu không có ở Header, tìm trong Cookie
        else if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt_token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        // 3. Nếu không tìm thấy Token hoặc Token bị rỗng -> Cho qua Filter và ngắt đoạn code sau
        if (jwt == null || jwt.trim().isEmpty()) {
            filterChain.doFilter(request, response);
            return; // RẤT QUAN TRỌNG: Phải return để không chạy code decode ở dưới
        }

        // 4. Giải mã và xác thực Token
        try {
            String userEmail = jwtDecoder.decode(jwt).getSubject();

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.verifyToken(jwt)) {
                    UserDetails userDetails = userDetailServiceCustomize.loadUserByUsername(userEmail);
                    UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            log.error("Xác thực JWT thất bại: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        // 5. Chuyển tiếp request sang Filter tiếp theo
        filterChain.doFilter(request, response);
    }

    // Bỏ qua Filter cho các file tĩnh (JS, CSS, Images) để tránh lỗi format response
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/css/") 
            || path.startsWith("/js/") 
            || path.startsWith("/images/") 
            || path.equals("/error");
    }
}