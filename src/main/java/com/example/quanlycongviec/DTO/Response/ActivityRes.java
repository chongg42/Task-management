package com.example.quanlycongviec.DTO.Response;

import java.time.LocalDateTime;

import com.example.quanlycongviec.DTO.Response.Summary.ProjectSummaryRes;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ActivityRes {
    private String status;
    private Integer id;

    private String action;
    private String resource;
    private String description;
    private LocalDateTime createdAt;
    private UserRes user;
    private Integer resourceId;
}
