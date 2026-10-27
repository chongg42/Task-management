package com.example.quanlycongviec.DTO.Response.Summary;

import com.example.quanlycongviec.Entity.enums.ProjectStatus;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProjectSummaryRes {
    private Integer id;
    private String name;
    private ProjectStatus status;
}