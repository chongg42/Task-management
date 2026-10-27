package com.example.quanlycongviec.Service;

import java.text.ParseException;
import java.util.Date;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.quanlycongviec.DTO.CustomUserDetails;
import com.example.quanlycongviec.DTO.JwtInfo;
import com.example.quanlycongviec.DTO.Request.LoginReq;
import com.example.quanlycongviec.DTO.Response.LoginRes;
import com.example.quanlycongviec.Entity.Token;
import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Repository.TokenRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final TokenRepo tokenRepo;

    public LoginRes login(LoginReq loginReq) {

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginReq.getEmail(),
                loginReq.getPassword());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userDetails.getUser();

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefeshToken(user);

        return LoginRes.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void logout(String token) throws ParseException {
        JwtInfo jwtInfo = jwtService.parseToken(token);
        String jwtId = jwtInfo.getJwtId();
        Date issuseTime = jwtInfo.getIssuseTime();
        Date expiredTime = jwtInfo.getExpiredTime();

        if (expiredTime.before(new Date()))
            return;
        Token redisToken = Token.builder()
                .jwtId(jwtId)
                .expiredTime(expiredTime.getTime() - issuseTime.getTime())
                .build();
        tokenRepo.save(redisToken);
    }

}
