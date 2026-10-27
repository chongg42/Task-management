package com.example.quanlycongviec.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quanlycongviec.DTO.Request.LoginReq;
import com.example.quanlycongviec.DTO.Response.LoginRes;
import com.example.quanlycongviec.Service.AuthenticationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public LoginRes login(@RequestBody LoginReq loginReq) {
        // TODO: process POST request

        return authenticationService.login(loginReq);
    }
    @PostMapping("/logout")
public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.replace("Bearer ", "").trim();
    try { authenticationService.logout(token); } catch (Exception ignored) { }
    return ResponseEntity.noContent().build();
}
    

}
