package com.example.quanlycongviec.DTO.Response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.quanlycongviec.Entity.enums.Gender;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserRes {

    private Integer id;

    private String fullName;

    private String email;

    private Gender gender;

    private LocalDate birthday;

    private String avatar;

    private LocalDateTime createdAt;
}
