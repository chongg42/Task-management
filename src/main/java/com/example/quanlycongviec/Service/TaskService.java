package com.example.quanlycongviec.Service;

import org.springframework.data.domain.Pageable;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.example.quanlycongviec.DTO.Response.TaskRes;
import com.example.quanlycongviec.DTO.Response.TaskStatusCountRes;
import com.example.quanlycongviec.Entity.list.TaskStatus;
import com.example.quanlycongviec.Mapper.TaskMap;
import com.example.quanlycongviec.Repository.TaskRepo;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TaskService {

    private final TaskRepo taskRepo;
    private final TaskMap taskMap;
     
    public Page<TaskRes> findTaskByUser (String keyword, TaskStatus status,Integer userId,Pageable pageable){
        if (keyword != null && !keyword.isEmpty()) {
            keyword = "%" + keyword + "%";
        } else {
            keyword = null;
        }
        if (status != null) {
            status=null;
        }
         if (userId != null && userId <= 0) {
            userId = null;
        }
        return taskRepo.findTaskByUser(keyword, status, userId, pageable).map(task->taskMap.toResponse(task));
    }
    public List<TaskStatusCountRes> countTaskByStatus(Integer userId){
        return taskRepo.countTaskByStatus(userId);
    }
}
