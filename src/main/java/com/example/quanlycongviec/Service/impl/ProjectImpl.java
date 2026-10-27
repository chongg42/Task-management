package com.example.quanlycongviec.Service.impl;

import com.example.quanlycongviec.Repository.UserRepo;

import java.util.ArrayList;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.DTO.Request.ProjectReq;
import com.example.quanlycongviec.DTO.Request.TaskReq;
import com.example.quanlycongviec.DTO.Response.ProjectRes;

import com.example.quanlycongviec.Entity.Project;
import com.example.quanlycongviec.Entity.Task;
import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Entity.enums.ProjectStatus;
import com.example.quanlycongviec.Mapper.ProjectMap;

import com.example.quanlycongviec.Repository.ProjectRepo;
import com.example.quanlycongviec.Service.AttachmentService;
import com.example.quanlycongviec.Service.IProject;
import com.example.quanlycongviec.Service.ITask;
import com.example.quanlycongviec.Utils.SecurityUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectImpl implements IProject {
    private final UserRepo userRepo;
    private final ProjectRepo projectRepo;
    private final ProjectMap projectMap;

    private final ITask taskService;
    private final AttachmentService attachmentService;
    @Value("${storage.upload-dir}")
    private String dir;

    @Override
    public ProjectRes findById(Integer id) {

        return projectMap.toProjectRes(
                projectRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy Project")));
    }

    @Override
    public Page<ProjectRes> getAllProject(String keyword, ProjectStatus projectStatus, Integer ngId,
            Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            keyword = "%" + keyword + "%";
        } else {
            keyword = null;
        }
        // if (projectStatus == '') {
        // projectStatus = null;
        // }
        if (ngId != null && ngId <= 0) {
            ngId = null;
        }
        return projectRepo.findProjectByUser(keyword, projectStatus, ngId, pageable)
                .map(pj -> projectMap.toProjectRes(pj));
    }

    @Override
    @Transactional
    public ProjectRes createdProject(ProjectReq projectReq, Integer userId, MultipartFile[] files) {
        Project project = projectMap.toEntity(projectReq);
        project.setDeleted(false);
        project.setOwner(
                userRepo.findById(userId).orElseThrow(() -> new RuntimeException("không tìm thấy người dùng")));
        final Project savedProject = projectRepo.save(project);
        // saveRelatedEntities(savedProject, projectReq);
        Set<Task> tasks = new HashSet<>();
        for (TaskReq taskReq : projectReq.getTasks()) {
            tasks.add(taskService.saveOrUpdateTask(savedProject, taskReq));

        }
        savedProject.setTasks(tasks);

        attachmentService.saveAttachments(savedProject, files);

        return projectMap.toProjectRes(savedProject);
    }

    @Override
    @Transactional
    public ProjectRes updateProject(Integer id, ProjectReq projectReq, MultipartFile[] files) {
        Project project = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Khoong tim thay sanr pham nao"));

        if (!Objects.equals(
                project.getOwner().getId(),
                SecurityUtils.getCurrentUserId())) {
            throw new AccessDeniedException(
                    "Bạn không có quyền cập nhật dự án này");
        }
        project.setName(projectReq.getName());
        project.setDescription(projectReq.getDescription());
        project.setStatus(projectReq.getStatus());

        Set<Task> dbTasks = project.getTasks(); // Lấy danh sách Task hiện tại trong DB
        Set<Task> updatedTasks = new HashSet<>();
        List<User> member = new ArrayList<>();

        // lưu task
        if (projectReq.getTasks() != null)
            for (TaskReq taskReq : projectReq.getTasks()) {
                Task processedTask = taskService.saveOrUpdateTask(project, taskReq);

                if (processedTask != null) {
                    // TaskRes taskRes = taskMap.toTaskRes(processedTask);
                    updatedTasks.add(processedTask);
                }
                member.addAll(userRepo.findAllById(taskReq.getAssigneeIds()));

            }
        project.setMembers(member.stream().collect(Collectors.toSet()));

        // tìm xem trong request có task trong db không
        Set<Integer> requestTaskIds = projectReq.getTasks() == null
                ? Collections.emptySet()
                : projectReq.getTasks().stream()
                        .map(TaskReq::getId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());
        for (Task task : dbTasks) {
            if (!requestTaskIds.contains(task.getId())) {
                task.setDeleted(true);
            }
        }
        attachmentService.saveAttachments(project, files);
        dbTasks.addAll(updatedTasks);
        return projectMap.toProjectRes(project);
    }

    @Override
    @Transactional
    public void deleteProject(Integer id) {
        Project project = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay san pham voi id: " + id));
        if (!Objects.equals(
                project.getOwner().getId(),
                SecurityUtils.getCurrentUserId())) {
            throw new AccessDeniedException(
                    "Bạn không có quyền cập nhật dự án này");
        }
        project.setDeleted(true);
        projectRepo.save(project);
    }

}
