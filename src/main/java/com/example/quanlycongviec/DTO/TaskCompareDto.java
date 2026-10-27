package com.example.quanlycongviec.DTO;

import java.time.LocalDateTime;
import java.util.Set;

import com.example.quanlycongviec.Entity.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor 
@NoArgsConstructor
public class TaskCompareDto {
    private Integer id;

    private String title;

    private String description;

    private TaskStatus status;

    private LocalDateTime dueDate;

    private Integer progress;

    private Set<Integer> assigneeUserIds;
}
