package com.example.quanlycongviec.Service.Resource.Activity;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.aspectj.lang.JoinPoint;
import org.springframework.stereotype.Component;

import com.example.quanlycongviec.AOP.TrackActivity;
import com.example.quanlycongviec.DTO.Request.TaskReq;
import com.example.quanlycongviec.Entity.ActivityLog;

import com.example.quanlycongviec.Entity.Task;
import com.example.quanlycongviec.Repository.ActivityRepo;
import com.example.quanlycongviec.Repository.TaskRepo;
import com.example.quanlycongviec.Utils.AOPUtils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
@Component
public class TaskActivityHandler implements ActivityResourceHandler {

    private final TaskRepo taskRepo;
    private final ActivityRepo activityRepo;

    @Override
    public String getResource() {
        return "TASK";
    }

    @Override
    public Map<Integer, Map<String, Object>> getMetadata(Set<Integer> resourceIds) {
        // Map<Integer, Map<String, Object>> metadata = new HashMap<>();

        List<Task> tasks = taskRepo.findAllById(resourceIds);

        return tasks.stream().collect(Collectors.toMap(task -> task.getId(), task -> {
            Map<String, Object> metadata = new HashMap<>();

            metadata.put("taskId", task.getId());
            metadata.put("taskTitle", task.getTitle());
            metadata.put("status", task.getStatus());

            return metadata;
        }));
    }

    @Override
    public ActivityLog buildLogs(JoinPoint joinPoint, TrackActivity annotation, String status, Object result) {
        if(result ==null) return null;
        if (!(result instanceof Task savedTask)) {
            return null;
        }
        TaskReq taskReq = AOPUtils.findArgument(joinPoint.getArgs(), TaskReq.class);
        boolean isCreate = (taskReq != null && taskReq.getId() == null) ? true : false;
        String action = isCreate ? "CREATE_TASK" : "UPDATE_TASK";
        String actionDesc = isCreate ? "Đã tạo công việc mới" : "Đã cập nhật công việc";
        if ("UPDATE_STATUS".equals(annotation.action()) && taskReq != null) {
            action = "UPDATE_STATUS";
            actionDesc = "Cập nhật task: " + taskReq.getTitle() + " - Trạng thái: " + taskReq.getStatus();
        }
        Integer projectId = (savedTask.getProject() != null) ? savedTask.getProject().getId() : null;
        ActivityLog log = ActivityLog.builder()
                .resource("TASK")
                .resourceId(savedTask.getId())
                .action(action)
                .description(actionDesc)
                .status(status)
                .projectId(projectId)
                .build();
        return activityRepo.save(log);

    }
}
