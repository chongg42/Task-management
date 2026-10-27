package com.example.quanlycongviec.AOP;

import java.util.List;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.example.quanlycongviec.Entity.ActivityLog;

import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Repository.ActivityRepo;

import com.example.quanlycongviec.Repository.UserRepo;
import com.example.quanlycongviec.Service.Resource.Activity.ActivityResourceHandler;
import com.example.quanlycongviec.Utils.SecurityUtils;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class ActivityLogAspect {
    // private final IActivitiLog activitiLog;
    private final List<ActivityResourceHandler> activityResource;
    private final UserRepo userRepo;

    @AfterReturning(pointcut = "@annotation(trackActivity)", returning = "result") // Hãy tìm tham số có tên result để
                                                                                   // truyền giá trị trả về vào.
    public void logSucces(JoinPoint joinPoint, TrackActivity trackActivity, Object result) throws Throwable {

        Log(joinPoint, trackActivity, "SUCCESS", result);

    }

    public void Log(JoinPoint joinPoint, TrackActivity trackActivity, String status, Object result) {
        log.info(trackActivity.resource());
        ActivityResourceHandler active = activityResource.stream()
                .filter(a -> trackActivity.resource().trim().equalsIgnoreCase(a.getResource().trim()))
                .findFirst()
                .orElseThrow(
                        () -> new RuntimeException("Không tìm thấy resource handler cho: " + trackActivity.resource()));

        ActivityLog activityLog = active.buildLogs(joinPoint, trackActivity, status, result);

        if (activityLog != null)
            activityLog.setUser(getUser());
    }

    private User getUser() {

        return userRepo.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));// Default fallback
    }

}
