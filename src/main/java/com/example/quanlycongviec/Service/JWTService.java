package com.example.quanlycongviec.Service;

import java.text.ParseException;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.quanlycongviec.DTO.JwtInfo;
import com.example.quanlycongviec.Entity.Token;
import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Repository.TokenRepo;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class JWTService {
    @Value ("${secretkey}")
    private  String secretKey;

    private final TokenRepo tokenRepo;
    public String generateAccessToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        Date issueTime = new Date();
        Date expirationTime= Date.from(issueTime.toInstant().plus(30,ChronoUnit.MINUTES));
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder().subject(user.getEmail())
                .issueTime(issueTime)
                .expirationTime(expirationTime)
                .jwtID(UUID.randomUUID().toString())
                .build();

        Payload payload=new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject=new JWSObject(header, payload);
        try {
             jwsObject.sign(new MACSigner(secretKey));
        } catch (Exception e) {
            // TODO: handle exception
        }
       return jwsObject.serialize();
    }
    public String generateRefeshToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        Date issueTime = new Date();
        Date expirationTime= Date.from(issueTime.toInstant().plus(30,ChronoUnit.DAYS));
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder().subject(user.getEmail())
                .issueTime(issueTime)
                .expirationTime(expirationTime)
                .build();

        Payload payload=new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject=new JWSObject(header, payload);
        try {
             jwsObject.sign(new MACSigner(secretKey));
        } catch (Exception e) {
            // TODO: handle exception
        }
       return jwsObject.serialize();
    }
    public  boolean verifyToken(String token) throws ParseException,JOSEException{
        SignedJWT signedJWT=SignedJWT.parse(token);
        Date expirationTime=signedJWT.getJWTClaimsSet().getExpirationTime();
        if(expirationTime.before(new Date())){
            return false;
        }

        String jwtId=signedJWT.getJWTClaimsSet().getJWTID();
        Optional<Token> byId=tokenRepo.findById(jwtId);
        if(byId.isPresent())
            throw new RuntimeException("Token invalid");
        return signedJWT.verify(new MACVerifier(secretKey));
    }

    public  JwtInfo parseToken(String token) throws ParseException{
        SignedJWT signedJWT =SignedJWT.parse(token);
        String jwtId=signedJWT.getJWTClaimsSet().getJWTID();
        Date issuseTime=signedJWT.getJWTClaimsSet().getIssueTime();
        Date expiredTime=signedJWT.getJWTClaimsSet().getExpirationTime();

        return JwtInfo.builder()
        .jwtId(jwtId)
        .issuseTime(issuseTime)
        .expiredTime(expiredTime)
        .build();
    }
}
