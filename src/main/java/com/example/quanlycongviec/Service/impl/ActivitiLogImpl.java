package com.example.quanlycongviec.Service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.quanlycongviec.DTO.Response.ActivityRes;
import com.example.quanlycongviec.Entity.ActivityLog;
import com.example.quanlycongviec.Mapper.ActivityMap;
import com.example.quanlycongviec.Repository.ActivityLogRepo;
import com.example.quanlycongviec.Service.IActivitiLog;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivitiLogImpl implements IActivitiLog {
    private final ActivityLogRepo activityLogRepo;
    private final ActivityMap activityMap;

    @Override
    public List<ActivityRes> findByProjectId(Integer id) {
                return activityLogRepo.findByProjectId(id).stream().map(a -> activityMap.toResponse(a))
                .collect(Collectors.toList());
    }

}
