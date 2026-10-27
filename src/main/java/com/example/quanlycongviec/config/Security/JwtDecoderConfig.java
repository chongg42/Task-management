package com.example.quanlycongviec.config.Security;

import java.nio.charset.StandardCharsets;
import java.util.Objects;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.example.quanlycongviec.Service.JWTService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
//quá trình giải mã và xác thực (validate) chuỗi JWT
public class JwtDecoderConfig implements JwtDecoder {
    private final JWTService jwtService;
    private NimbusJwtDecoder nimbusJwtDecoder = null;
    @Value("${secretkey}")
    private String secretKey;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            if (!jwtService.verifyToken(token)) {
                throw new RuntimeException("Invalid Token");
            }
            if (Objects.isNull(nimbusJwtDecoder)) {
                SecretKey secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HS512");
                nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)        
                .build();

            }
        } catch (Exception e) {
            // TODO: handle exception
            throw new JwtException("Error decoding token: " + e.getMessage());
        }
        return nimbusJwtDecoder.decode(token);
    }
}
