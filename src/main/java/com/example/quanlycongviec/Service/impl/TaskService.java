package com.example.quanlycongviec.Service.impl;

import org.springframework.data.domain.Pageable;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.javers.core.Javers;
import org.javers.core.JaversBuilder;
import org.javers.core.MappingStyle;
import org.javers.core.diff.Diff;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.Controller.AOP.TrackActivity;
import com.example.quanlycongviec.DTO.TaskCompareDto;
import com.example.quanlycongviec.DTO.Request.TaskReq;
import com.example.quanlycongviec.DTO.Response.TaskRes;
import com.example.quanlycongviec.DTO.Response.TaskStatusCountRes;
import com.example.quanlycongviec.Entity.Attachment;
import com.example.quanlycongviec.Entity.Project;
import com.example.quanlycongviec.Entity.Task;
import com.example.quanlycongviec.Entity.TaskAssignees;
import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Entity.enums.TaskStatus;
import com.example.quanlycongviec.Mapper.TaskMap;
import com.example.quanlycongviec.Repository.TaskRepo;
import com.example.quanlycongviec.Repository.UserRepo;
import com.example.quanlycongviec.Service.AttachmentService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TaskService {
    private final UserRepo userRepo;
    private final TaskRepo taskRepo;
    private final TaskMap taskMap;
    private final AttachmentService attachmentService;
    private final Javers javers;

    public Set<TaskRes> findAllByProjectId(Integer projectId) {

        return taskRepo.findAllByProjectId(projectId).stream().map(task -> taskMap.toResponse(task))
                .collect(Collectors.toSet());
    }

    @TrackActivity(action = "UPDATE_STATUS", resource = "TASK")
    @Transactional
    public TaskRes updateStatus(Integer taskId, TaskStatus newStatus, MultipartFile file, Integer userId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task"));

        // RÀNG BUỘC: Nếu đổi sang DONE mà không có file đính kèm
        if (newStatus == TaskStatus.HOAN_THANH) {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("Bắt buộc phải upload file đính kèm khi hoàn thành công việc!");
            } else {
                Attachment attachment = attachmentService.creaAttachment(file);
                attachment.setTask(task);
                attachment.setProject(task.getProject());
                attachment.setUser(
                        userRepo.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy user")));
            }
        }

        task.setStatus(newStatus);
        return taskMap.toResponse(taskRepo.save(task));
    }

    public Page<TaskRes> findTaskByUser(String keyword, TaskStatus status, Integer userId, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            keyword = "%" + keyword + "%";
        } else {
            keyword = null;
        }
        if (status != null) {
            status = null;
        }
        if (userId != null && userId <= 0) {
            userId = null;
        }
        return taskRepo.findTaskByUser(keyword, status, userId, pageable).map(task -> taskMap.toResponse(task));
    }

    public Page<TaskRes> findByProject(String keyword, TaskStatus status, Integer projectId, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            keyword = "%" + keyword + "%";
        } else {
            keyword = null;
        }
        // if (status != null) {
        // status = null;
        // }
        // if (projectId != null && projectId <= 0) {
        // projectId = null;
        // }
        return taskRepo.findByProject(projectId, keyword, status, pageable).map(task -> taskMap.toResponse(task));
    }

    public List<TaskStatusCountRes> countTaskByStatus(Integer userId) {
        return taskRepo.countTaskByStatus(userId);
    }

    public void deletedTask(Integer id) {
        Task task = taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy task nào"));
        task.setDeleted(true);
        taskRepo.save(task);
    }

    @TrackActivity(resource = "TASK")
    @Transactional
    public Task saveOrUpdateTask(Project project, TaskReq taskReq) {
        // 1. TẠO MỚI
        if (taskReq.getId() == null) {
            Task task = taskMap.toTask(taskReq);
            task.setProject(project);
            task.setProgress(0);
            task.setDeleted(false);
            saveAssignee(task, taskReq.getAssigneeIds());
            return taskRepo.save(task);
        }

        // 2. CẬP NHẬT
        Task existingTask = taskRepo.findById(taskReq.getId())
                .orElseThrow(() -> new RuntimeException("Task không tồn tại"));

        // Tạo Snapshot (Bản sao mốc ban đầu)
        TaskCompareDto oldSnapshotDto = taskMap.fromEntity(existingTask);
        // BeanUtils.copyProperties(existingTask, snapshot);

        // Tiến hành cập nhật dữ liệu mới vào existingTask
        existingTask.setTitle(taskReq.getTitle());
        existingTask.setDescription(taskReq.getDescription());
        existingTask.setStatus(taskReq.getStatus());
        existingTask.setProject(project);
        existingTask.setDueDate(taskReq.getDueDate());
        existingTask.setProgress(taskReq.getProgress());
        
        saveAssignee(existingTask, taskReq.getAssigneeIds());

        TaskCompareDto updatedDto = taskMap.fromEntity(existingTask);
        Diff diff = javers.compare(updatedDto,oldSnapshotDto );

        if (diff.hasChanges())
            return taskRepo.save(existingTask);

        return null; // Không có thay đổi -> Trả về entity hiện tại, không gọi save()
    }

    public void saveAssignee(Task task, Iterable<Integer> ids) {

        if (task.getTaskAssignees() == null) {
            task.setTaskAssignees(new HashSet<>());
        }
        Set<Integer> newid = new HashSet<>();
        if (ids != null) {
            ids.forEach(id -> newid.add(id));
        }

        // kiểm tra xem user nằm trong task có ở trong request nữa không
        for (TaskAssignees assignees : task.getTaskAssignees()) {
            Integer userId = assignees.getUser().getId();
            if (!newid.contains(userId)) {
                assignees.setIsDeleted(true);
                ;
            } else
                assignees.setIsDeleted(false);
        }

        // lấy user có trong request mà không có trong task
        Set<TaskAssignees> newAssignees = new HashSet<>();

        for (Integer id : newid) {

            boolean exists = task.getTaskAssignees().stream()
                    .anyMatch(a -> a.getUser().getId().equals(id));

            if (!exists) {
                User user = userRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Không thấy user"));

                TaskAssignees ta = new TaskAssignees();
                ta.setTask(task);
                ta.setUser(user);

                newAssignees.add(ta);
            }
        }

        task.getTaskAssignees().addAll(newAssignees);
    }

    public TaskRes updateTaskPartial(Integer id,TaskReq taskReq){
        return null;
    }
}
