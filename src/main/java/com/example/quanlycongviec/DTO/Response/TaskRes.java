package com.example.quanlycongviec.DTO.Response;

import java.time.LocalDateTime;
import java.util.Set;
import com.example.quanlycongviec.Entity.enums.TaskStatus;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
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

    private Set<Integer> assigneeIds;
  private Integer progress;
    // private List<TagResponse> tags;

    private LocalDateTime createdAt;
}
