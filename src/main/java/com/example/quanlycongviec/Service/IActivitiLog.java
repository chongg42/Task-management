package com.example.quanlycongviec.Service;

import java.util.List;

import com.example.quanlycongviec.DTO.Response.ActivityRes;



public interface IActivitiLog {
    public List<ActivityRes>findAllByProjectId (Integer id);
    
}
