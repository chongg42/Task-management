package com.example.quanlycongviec.DTO.Request;

import java.time.LocalDateTime;
import java.util.Set;

import com.example.quanlycongviec.Entity.enums.ProjectStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectReq {
    
    private String name;
    private String description;
    private ProjectStatus status;
    private Boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private LocalDateTime startDate;
    private Set<TaskReq> tasks;
    private Set<Integer> deleteFileIds;

}
