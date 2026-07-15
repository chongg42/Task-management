package com.example.quanlycongviec.DTO.Response;

import java.util.Set;

import com.example.quanlycongviec.Entity.ActivityLog;
import com.example.quanlycongviec.Entity.list.ProjectStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectRes {

    private Integer id;
    private String name;
    private String description;
    private ProjectStatus status;

    private UserRes owner;

    private Set<UserRes> members;
    private Set<TaskRes> taskRes;
}
