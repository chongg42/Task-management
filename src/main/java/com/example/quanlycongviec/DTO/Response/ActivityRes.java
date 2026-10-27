package com.example.quanlycongviec.DTO.Response;

import java.time.LocalDateTime;
import java.util.Map;

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
    private Map<String, Object> metadata;
    private Integer projectId;
}
