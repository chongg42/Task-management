package com.example.quanlycongviec.Mapper;

import org.springframework.stereotype.Component;

import com.example.quanlycongviec.DTO.Response.ActivityRes;
import com.example.quanlycongviec.Entity.ActivityLog;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ActivityMap {
    private final UserMap userMap;

    public ActivityRes toResponse(ActivityLog activityLog) {
        return ActivityRes.builder()
                .id(activityLog.getId())
                .action(activityLog.getAction())
                .createdAt(activityLog.getCreatedAt())
                .description(activityLog.getDescription())
                .resource(activityLog.getResource())
                .status(activityLog.getStatus())
                .resourceId(activityLog.getResourceId())
                .user(userMap.toUserRes(activityLog.getUser()))
                .build();
    }
}
