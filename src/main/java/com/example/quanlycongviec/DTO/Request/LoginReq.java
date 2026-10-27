package com.example.quanlycongviec.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
public class LoginReq {
    private String email;
    private String password;
}
