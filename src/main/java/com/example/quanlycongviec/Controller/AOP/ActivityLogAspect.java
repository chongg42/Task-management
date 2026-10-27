package com.example.quanlycongviec.Controller.AOP;

import java.time.LocalDateTime;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.DTO.Request.TaskReq;
import com.example.quanlycongviec.Entity.ActivityLog;
import com.example.quanlycongviec.Entity.Attachment;
import com.example.quanlycongviec.Entity.Project;
import com.example.quanlycongviec.Entity.Task;
import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Mapper.UserMap;
import com.example.quanlycongviec.Repository.ActivityLogRepo;
import com.example.quanlycongviec.Repository.ProjectRepo;
import com.example.quanlycongviec.Repository.UserRepo;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Aspect
@Component
@RequiredArgsConstructor
public class ActivityLogAspect {
    private final HttpSession session;
    private final UserRepo userRepo;
    private final ActivityLogRepo activityLogRepo;

    @AfterReturning(pointcut = "@annotation(trackActivity)", returning = "result") // Hãy tìm tham số có tên result để
                                                                                   // truyền giá trị trả về vào.
    public void logSucces(JoinPoint joinPoint, TrackActivity trackActivity, Object result) {
        saveLog(joinPoint, trackActivity, "SUCCESS", result);
    }

    public void saveLog(JoinPoint joinPoint, TrackActivity trackActivity, String status, Object result) {
        if (result != null) {

            Object[] args = joinPoint.getArgs();

            String resourceType = trackActivity.resource();

            if ("TASK".equals(resourceType) && args.length > 0) {
                Task savedTask = (result instanceof Task) ? (Task) result : null;
                if (savedTask != null) {
                    TaskReq taskReqParam = findArgument(args, TaskReq.class);
                boolean isCreate = (taskReqParam != null && taskReqParam.getId() == null);
                String action = isCreate ? "CREATE_TASK" : "UPDATE_TASK";
                String actionDesc = isCreate ? "đã tạo công việc mới" : "đã cập nhật công việc";
                if ("UPDATE_STATUS".equals(trackActivity.action())) {
                    action = "UPDATE_STATUS";
                    actionDesc = "Cập nhật task: " + taskReqParam.getTitle() + " - Trạng thái: "
                            + taskReqParam.getStatus();
                }
                saveLog(resourceType, actionDesc, action, savedTask.getId(),status);
                }
               
                // 4. Lấy Task trả về từ result (để chắc chắn lấy được ID và thông tin đã lưu)
                
            }

            // else if ("PROJECT".equals(resourceType) && args.length > 0)

            // {
            // // Tương tự cho phân hệ Project
            // if (args[0] instanceof Integer) {
            // Integer projectId = (Integer) args[0];
            // projectRepo.findById(projectId).ifPresent(project -> {
            // log.setProject(project);

            // });
            // }
            // }
            else if ("ATTACHMENT".equals(resourceType)) {
                Attachment attachmentsave=(result instanceof Attachment)?(Attachment) result:null;
                for (Object arg : args) {
                    if (arg instanceof MultipartFile file && !file.isEmpty()) {
                        saveLog(resourceType, trackActivity.action(),
                                "Đã tải lên file đính kèm: " + file.getOriginalFilename(),attachmentsave.getId(),status);
                    }
                }
                
            }
        }

    }

    private void saveLog(String resource, String action, String description, Integer resourceId,String status) {
        // Lấy userId hiện tại đang đăng nhập (tùy thuộc vào cách bạn quản lý Auth/JWT)

        ActivityLog log = ActivityLog.builder()
                .resource(resource)
                .resourceId(resourceId)
                .action(action)
                .description(description)
                .user(getUser())
                .status(status)
                .createdAt(LocalDateTime.now())
                .build();

        activityLogRepo.save(log);
    }

    private User getUser() {
        // Code lấy ID user đăng nhập từ SecurityContext (Sửa theo project của bạn)
        // Example:
        // UserDetailsImpl user = (UserDetailsImpl)
        // SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // return user.getId();
        return userRepo.findById((Integer) session.getAttribute("userID"))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));// Default fallback
    }

    @SuppressWarnings("unchecked")
    private <T> T findArgument(Object[] args, Class<T> clazz) {
        if (args == null)
            return null;
        for (Object arg : args) {
            if (clazz.isInstance(arg)) {
                return (T) arg;
            }
        }
        return null;
    }
}
