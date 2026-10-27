package com.example.quanlycongviec.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.DTO.UpdateTaskStatusProgressReq;
import com.example.quanlycongviec.DTO.Request.TaskReq;
import com.example.quanlycongviec.DTO.Response.TaskRes;
import com.example.quanlycongviec.DTO.Response.TaskStatusCountRes;
import com.example.quanlycongviec.Entity.Project;
import com.example.quanlycongviec.Entity.Task;
import com.example.quanlycongviec.Entity.enums.TaskStatus;

public interface ITask {
     public Set<TaskRes> findAllByProjectId(Integer projectId);

     public TaskRes updateStatus(Integer taskId, TaskStatus newStatus, MultipartFile file, Integer userId);

     public Page<TaskRes> findTaskByUser(String keyword, TaskStatus status, Integer userId, Pageable pageable);

     public Page<TaskRes> findByProject(String keyword, TaskStatus status, Integer projectId, Pageable pageable);

     public List<TaskStatusCountRes> countTaskByStatus(Integer userId);

     public void deletedTask(Integer id);

     public Task saveOrUpdateTask(Project project, TaskReq taskReq);

     public void saveAssignee(Task task, Iterable<Integer> ids);

     TaskRes updateStatusAndProgress(Integer taskId, UpdateTaskStatusProgressReq req, MultipartFile file);

     public Map<TaskStatus, List<TaskRes>> getKanbanBoard() ;
}
