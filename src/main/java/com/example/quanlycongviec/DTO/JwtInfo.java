package com.example.quanlycongviec.DTO;

import java.io.Serializable;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor 
public class JwtInfo implements Serializable {
    private String jwtId;
    private Date issuseTime;
    private Date expiredTime;
}
