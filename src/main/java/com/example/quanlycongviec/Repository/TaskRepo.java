package com.example.quanlycongviec.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.quanlycongviec.DTO.Response.TaskStatusCountRes;
import com.example.quanlycongviec.Entity.Task;
import com.example.quanlycongviec.Entity.enums.TaskStatus;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    @Query("select t from Task t JOIN TaskAssignees ta on ta.task=t where  (:key is null or t.title like %:key%) and (:status is null or t.status=:status) and( ta.user.id=:userId) and (t.id!=0) ")
    Page<Task> findTaskByUser(@Param("key") String key, @Param("status") TaskStatus status,
            @Param("userId") Integer userId, Pageable pageable);

    @Query("select t from Task t where (:key is null or t.title like %:key%) and (:status is null or t.status =:status) and (t.project.id=:projectId)")
    Page<Task> findByProject(@Param("projectId") Integer projectId, @Param("key") String key,
            @Param("status") TaskStatus status, Pageable pageable);

    @Query("select t.status,count(t)  from Task t join t.taskAssignees ta where ta.user.id=:id group by t.status ")
    List<TaskStatusCountRes> countTaskByStatus(@Param("id") Integer id);

    Set<Task> findAllByProjectId(Integer projectId);

    @Query("select t from Task t JOIN TaskAssignees ta on ta.task=t where ( ta.user.id=:userId) and (t.deleted=false)")
    Set<Task> findAllByUser(@Param("userId") Integer userId);
}
