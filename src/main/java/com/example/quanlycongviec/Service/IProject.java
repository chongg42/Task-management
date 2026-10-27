package com.example.quanlycongviec.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.DTO.Request.ProjectReq;
import com.example.quanlycongviec.DTO.Response.ProjectRes;
import com.example.quanlycongviec.Entity.enums.ProjectStatus;

public interface IProject {

    public ProjectRes findById(Integer id);

    public Page<ProjectRes> getAllProject(String keyword, ProjectStatus projectStatus, Integer ngId,
            Pageable pageable);

    public ProjectRes createdProject(ProjectReq projectReq, Integer userId, MultipartFile[] files);

    public ProjectRes updateProject(Integer id, ProjectReq projectReq,MultipartFile[] files);

    public void deleteProject(Integer id);
}
