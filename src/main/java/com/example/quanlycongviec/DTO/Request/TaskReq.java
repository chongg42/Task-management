package com.example.quanlycongviec.DTO.Request;

import java.time.LocalDateTime;
import java.util.Set;

import com.example.quanlycongviec.Entity.enums.TaskStatus;

import lombok.Data;

@Data
public class TaskReq {

    private Integer id;
    private String title;

    private String description;

    private TaskStatus status;

    private LocalDateTime dueDate;

    private Integer progress;

    // Project mà task thuộc về
    private Integer projectId;

    // Nếu 1 task chỉ có 1 comment gốc (theo Entity hiện tại)
    private Integer commentId;

    // Danh sách Tag
    private Set<Integer> tagIds;

    // Danh sách thành viên được giao
    private Set<Integer> assigneeIds;
}
