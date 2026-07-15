package com.example.quanlycongviec.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class Auth {
    @GetMapping("/login")
    public String login(HttpSession session) {
        session.setAttribute("userID", 1);
        return "Đăng nhập oke";
    }
    
}
