package com.example.quanlycongviec.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.quanlycongviec.DTO.Response.TaskStatusCountRes;
import com.example.quanlycongviec.Entity.Task;
import com.example.quanlycongviec.Entity.list.TaskStatus;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    @Query("select t from Task t JOIN TaskAssignees ta on ta.task=t where  (:key is null or t.title like %:key%) and (:status is null or t.status=:status) and( ta.user.id=:userId) ")
    Page<Task> findTaskByUser(@Param("key") String key, @Param("status") TaskStatus status,
            @Param("userId") Integer userId, Pageable pageable);
    Page<Task> findByProjectId(Integer projects_id,Pageable pageable);

    @Query("select t.status,count(t)  from Task t join t.taskAssignees ta where ta.user.id=:id group by t.status ")
    List<TaskStatusCountRes> countTaskByStatus(@Param("id") Integer id);
}
