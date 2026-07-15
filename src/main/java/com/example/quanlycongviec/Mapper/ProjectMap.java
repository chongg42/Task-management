package com.example.quanlycongviec.Mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.quanlycongviec.DTO.Response.ProjectRes;
import com.example.quanlycongviec.Entity.Project;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProjectMap {
    private final UserMap userMapper;
    private final TaskMap taskMapper;

    public ProjectRes toProjectRes(Project project) {
        if (project == null) {
            return null;
        }

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
                .taskRes(
                        project.getTasks()
                                .stream()
                                .map(taskMapper::toResponse)
                                .collect(Collectors.toSet()))
                .build();
    }
}
