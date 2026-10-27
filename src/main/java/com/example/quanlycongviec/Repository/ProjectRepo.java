package com.example.quanlycongviec.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.quanlycongviec.Entity.Project;
import com.example.quanlycongviec.Entity.enums.ProjectStatus;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ProjectRepo extends JpaRepository<Project,Integer>{
    Optional<Project> findById(Integer id);
     @Query("select distinct p from Project p Left JOIN p.members pm  where  (:key is null or p.name like %:key%) and (:status is null or p.status=:status) and( pm.id=:userId or p.owner.id=:userId) and(p.deleted=false)")
    Page<Project> findProjectByUser(@Param("key") String key, @Param("status") ProjectStatus status,
            @Param("userId") Integer userId, Pageable pageable);

}
        