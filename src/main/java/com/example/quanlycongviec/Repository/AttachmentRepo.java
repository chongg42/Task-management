package com.example.quanlycongviec.Repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.quanlycongviec.Entity.Attachment;
import com.example.quanlycongviec.Entity.enums.AttachmentResource;

import java.util.List;
import java.util.Optional;

public interface AttachmentRepo extends JpaRepository<Attachment, Integer> {
       @Query("""
                         SELECT a
                         FROM Attachment a
                         WHERE a.resourceType = :resourceType OR a.resourceType=null
                           AND a.resourceId = :resourceId OR a.resourceId=null
                           AND a.isDeleted = false
                     """)
       Set<Attachment> findAttachments(
                     @Param("resourceType") AttachmentResource resourceType,
                     @Param("resourceId") Integer resourceId);

       Optional<Attachment> findById(Integer id);
       // Set<Attachment> findAllByIdIn(List<Integer>id);
       List<Attachment> findAllByresourceIdIn(Set<Integer> resourceId);
}
