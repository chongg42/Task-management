package com.example.quanlycongviec.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.quanlycongviec.DTO.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        String targetUrl = determineTargetUrl(authentication);

        if (response.isCommitted()) {
            return;
        }

        redirectStrategy.sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(Authentication authentication) {

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails customUserDetails) {

            // 2. Kiểm tra nếu thông tin bị null / chưa cập nhật
            if (customUserDetails.isProfileIncomplete()) {
                return "/caidat"; // URL trang cập nhật thông tin
            }

        }
        return "/";

    }
}
