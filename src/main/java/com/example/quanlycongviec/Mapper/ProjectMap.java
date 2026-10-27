package com.example.quanlycongviec.Mapper;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

import com.example.quanlycongviec.DTO.Request.ProjectReq;
import com.example.quanlycongviec.DTO.Response.AttachmentRes;
import com.example.quanlycongviec.DTO.Response.ProjectRes;
import com.example.quanlycongviec.DTO.Response.TaskRes;
import com.example.quanlycongviec.DTO.Response.Summary.ProjectSummaryRes;
import com.example.quanlycongviec.Entity.Attachment;
import com.example.quanlycongviec.Entity.Project;
import com.example.quanlycongviec.Entity.enums.AttachmentResource;
import com.example.quanlycongviec.Repository.AttachmentRepo;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Builder
public class ProjectMap {
    private final UserMap userMapper;
    private final AttachmentRepo attachmentRepo;
    private final TaskMap taskMapper;
    private final AttachmentMap attachmentMap;

    public ProjectRes toProjectRes(Project project) {
        if (project == null) {
            return null;
        }
        Set<TaskRes> mappedTasks = project.getTasks() == null ? new HashSet<>()
                : project.getTasks().stream()
                        .map(taskMapper::toResponse)
                        .collect(Collectors.toSet());
        Set<Attachment> attachments=attachmentRepo.findAttachments(AttachmentResource.PROJECT, project.getId());
        Set<AttachmentRes> mappedAtt =attachments  == null ? new HashSet<>()
                : attachments.stream().map(x -> attachmentMap.toResponse(x))
                        .collect(Collectors.toSet());
        return ProjectRes.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .owner(userMapper.toUserRes(project.getOwner()))
                .members(
                project.getMembers()
                .stream()
                .map(userMapper::toUserRes)
                .collect(Collectors.toSet()))
                .startDate(project.getStartDate())
                .dueDate(project.getDueDate())
                .taskRes(mappedTasks)
                .attachments(mappedAtt)
                .build();
    }

    public Project toEntity(ProjectReq projectReq) {
        if (projectReq == null) {
            return null;
        }

        return Project.builder()
                .name(projectReq.getName())
                .description(projectReq.getDescription())
                .createdAt(LocalDateTime.now())
                .status(projectReq.getStatus())
                .startDate(projectReq.getStartDate())
                .dueDate(projectReq.getDueDate())
                .build();

    }
    public ProjectSummaryRes toSummary(Project project) {
    return ProjectSummaryRes.builder()
            .id(project.getId())
            .name(project.getName())
            .status(project.getStatus())
            .build();
}
}
