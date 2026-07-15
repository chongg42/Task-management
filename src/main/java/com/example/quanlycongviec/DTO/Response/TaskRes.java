package com.example.quanlycongviec.DTO.Response;

import java.time.LocalDateTime;
import java.util.List;

import com.example.quanlycongviec.Entity.list.TaskStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskRes {

     private Integer id;

    private String title;

    private String description;

    private TaskStatus status;

    private LocalDateTime dueDate;
   
    private LocalDateTime updateAt;

    private Integer projectId;

    private String projectName;

    private String createdByName;

    private List<UserRes> members;

    // private List<TagResponse> tags;

    private LocalDateTime createdAt;
}
