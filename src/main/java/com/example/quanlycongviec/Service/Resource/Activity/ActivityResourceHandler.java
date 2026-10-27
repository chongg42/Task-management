package com.example.quanlycongviec.Service.Resource.Activity;
import java.util.Map;
import java.util.Set;

import org.aspectj.lang.JoinPoint;

import com.example.quanlycongviec.AOP.TrackActivity;
import com.example.quanlycongviec.Entity.ActivityLog;

public interface ActivityResourceHandler {

    public abstract String getResource();

    public abstract Map<Integer, Map<String, Object>> getMetadata(Set<Integer> resourceIds);
    
    public ActivityLog buildLogs(JoinPoint joinPoint, TrackActivity annotation, String status, Object result);
   
}