package com.example.quanlycongviec.DTO.Response;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import com.example.quanlycongviec.Entity.enums.ProjectStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class ProjectRes {

    private Integer id;
    private String name;
    private String description;
    private ProjectStatus status;
    private UserRes owner;
    @Builder.Default
    private Set<UserRes> members=new HashSet<>();
    @Builder.Default
    private Set<TaskRes> taskRes =new HashSet<>();
    @Builder.Default
    private Set<AttachmentRes>attachments=new HashSet<>();
    private LocalDateTime dueDate;
    private LocalDateTime startDate;
}
