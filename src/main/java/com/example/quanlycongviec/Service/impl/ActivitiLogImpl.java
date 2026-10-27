package com.example.quanlycongviec.Service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.quanlycongviec.DTO.Response.ActivityRes;
import com.example.quanlycongviec.Entity.ActivityLog;
import com.example.quanlycongviec.Entity.enums.ResourceActivity;
import com.example.quanlycongviec.Mapper.UserMap;
import com.example.quanlycongviec.Repository.ActivityRepo;
import com.example.quanlycongviec.Service.IActivitiLog;
import com.example.quanlycongviec.Service.Resource.Activity.ActivityResourceHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivitiLogImpl implements IActivitiLog {
    private final ActivityRepo activityLogRepo;
    private final List<ActivityResourceHandler> handler;

    private final UserMap userMap;

    @Override
    public List<ActivityRes> findAllByProjectId(Integer projectId) {
        if (projectId == null)
            return Collections.emptyList();

        // Query 1: Lấy danh sách Log
        List<ActivityLog> logs = activityLogRepo.findAllByProjectId(projectId);
        if (logs.isEmpty())
            return Collections.emptyList();
        Map<Integer, Object> data = getMetaData(logs);

        return logs.stream().map(log -> {
            
            return ActivityRes.builder()
                    .id(log.getId())
                    .resource(log.getResource())
                    .action(log.getAction())
                    .description(log.getDescription())
                    .status(log.getStatus())
                    .projectId(log.getProjectId())
                    .metadata(doi(data.get(log.getResourceId())))
                    .createdAt(log.getCreatedAt())
                    .user(userMap.toUserRes(log.getUser()))
                    .build();
        }).collect(Collectors.toList());
    }

    public Map<Integer, Object> getMetaData(List<ActivityLog> logs) {
        Map<String, Set<Integer>> resourceIds = new HashMap<>();
        for (ResourceActivity r : ResourceActivity.values()) {
            for (ActivityLog l : logs) {
                if (r.toString().equals(l.getResource()))
                    resourceIds.computeIfAbsent(r.toString(), k -> new HashSet<>())
                            .add(l.getResourceId());
            }
        }
        return resourceIds.entrySet().stream().map(entry -> {
            log.info("RESOURCE = " + entry.getKey());
            log.info("RESOURCE IDS = " + entry.getValue());
            Map<Integer, Map<String, Object>> metadataMap = handler.stream()
                    .filter(h -> h.getResource().equalsIgnoreCase(entry.getKey()))
                    .findFirst()
                    .map(h -> h.getMetadata(resourceIds.get(entry.getKey())))
                    .orElseGet(() -> new HashMap<Integer, Map<String, Object>>());
            return metadataMap;
        })
                .flatMap(map -> map.entrySet().stream())
                .collect(Collectors.toMap(entry -> entry.getKey(), // Tự động chuyển Key sang String
                        Map.Entry::getValue,
                        (existing, replacement) -> replacement));
    }

    public Map<String, Object> doi(Object data) {
        if (data instanceof Map<?, ?> map) {
            return map.entrySet()
                    .stream()
                    .collect(Collectors.toMap(
                            e -> (String) e.getKey(),
                            Map.Entry::getValue));
        }
        return new HashMap<>();
    }

    // @Override
    // public ActivityLog buildLog(
    // String action,
    // String description,
    // ActivityResult result,
    // ActivityResource resource,
    // String groupId,
    // User user) {

    // return ActivityLog.builder()
    // .action(action)
    // .description(description)
    // .resource(resource.getResource())
    // .resourceId(resource.getResourceId())
    // .status(result.getStatus())
    // .projectId(result.getProjectId())
    // .user(user)
    // .createdAt(LocalDateTime.now())
    // // Nếu Entity ActivityLog của bạn chưa có groupId,
    // // hãy thêm field này hoặc bỏ dòng dưới.
    // // .groupId(groupId)
    // .build();
    // }
}