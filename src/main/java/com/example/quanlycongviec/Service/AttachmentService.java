package com.example.quanlycongviec.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.AOP.TrackActivity;
import com.example.quanlycongviec.DTO.Response.AttachmentRes;
import com.example.quanlycongviec.Entity.Attachment;
import com.example.quanlycongviec.Entity.Project;
import com.example.quanlycongviec.Entity.enums.AttachmentResource;
import com.example.quanlycongviec.Entity.enums.ResourceActivity;
import com.example.quanlycongviec.Mapper.AttachmentMap;
import com.example.quanlycongviec.Repository.AttachmentRepo;
import com.example.quanlycongviec.Utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttachmentService {
    @Value("${storage.upload-dir}")
    private String dir;
    private final AttachmentRepo attachmentRepo;
    private final AttachmentMap attachmentMap;

    public AttachmentRes findById(Integer id) {
        return attachmentMap.toResponse(
                attachmentRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy file nào")));
    }

    @TrackActivity(action = "UPLOAD_ATTACHMENT", resource = "FILE")
    public Attachment creaAttachment(MultipartFile file,Integer resourceId) {
        Path upPath = Paths.get(dir);

        try {
            if (!Files.exists(upPath))
                Files.createDirectories(upPath);
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = upPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            Attachment attachment = new Attachment();
            attachment.setOriginalFileName(file.getOriginalFilename());
            attachment.setUploadAt(LocalDateTime.now());
            attachment.setStoredFileName(fileName);
            attachment.setFileUrl(dir + fileName);
            attachment.setFileSize((int) file.getSize());
            attachment.setResourceId(resourceId);
            attachment.setResourceType(AttachmentResource.TASK);
            attachment.setIsDeleted(false);
            attachment.setUser(SecurityUtils.getCurrentUserDetails().orElseThrow(()->new Exception("Không tìm thấy user")).getUser());
            return attachmentRepo.save(attachment);
        } catch (Exception e) {

            e.getMessage();
        }
        return null;
    }

    // public Set<AttachmentRes> findAllById(List<Integer> id){
    // return
    // attachmentRepo.findAllByIdIn(id).stream().map(at->attachmentMap.toResponse(at)).collect(Collectors.toSet());
    // }
    @TrackActivity(action = "UPLOAD_ATTACHMENT", resource = "FILE")
    public Set<Attachment> saveAttachments(Project project, MultipartFile[] files) {
        Set<Path> savedFiles = new HashSet<>();
        Path upPath = Paths.get(dir);

        try {
            if (!Files.exists(upPath)) {
                Files.createDirectories(upPath);
            }

            // 1. Lấy danh sách file hợp lệ từ request (nếu null thì coi như mảng rỗng)
            List<MultipartFile> validFiles = (files != null && files.length > 0)
                    ? Arrays.stream(files).filter(f -> f != null && !f.isEmpty()).collect(Collectors.toList())
                    : List.of();

            Set<String> incomingOriginalNames = validFiles.stream()
                    .map(file -> Paths.get(file.getOriginalFilename()).getFileName().toString())
                    .collect(Collectors.toSet());

            // 2. Lấy danh sách attachment hiện tại trong DB
            Set<Attachment> existingAttachments = attachmentRepo.findAttachments(AttachmentResource.PROJECT,
                    project.getId());

            // 3. Xử lý Soft-Delete các file không còn xuất hiện trong request
            Set<Attachment> attachmentsToSoftDelete = new HashSet<>();
            for (Attachment attachment : existingAttachments) {
                if (!incomingOriginalNames.contains(attachment.getOriginalFileName())) {
                    attachment.setIsDeleted(true);
                    attachmentsToSoftDelete.add(attachment);
                }
            }
            if (!attachmentsToSoftDelete.isEmpty()) {
                attachmentRepo.saveAll(attachmentsToSoftDelete);
            }

            // 4. Nếu không có file mới cần upload thì kết thúc sớm (sau khi đã soft-delete)
            if (validFiles.isEmpty()) {
                return Collections.emptySet();
            }

            // 5. Upload các file mới chưa từng tồn tại
            Set<String> existingNamesInDb = existingAttachments.stream()
                    .map(Attachment::getOriginalFileName)
                    .collect(Collectors.toSet());

            Set<Attachment> newAttachments = new HashSet<>();
            for (MultipartFile file : validFiles) {
                String cleanOriginalName = Paths.get(file.getOriginalFilename()).getFileName().toString();

                if (!existingNamesInDb.contains(cleanOriginalName)) {
                    String fileName = UUID.randomUUID() + "_" + cleanOriginalName;
                    Path filePath = upPath.resolve(fileName);

                    Files.copy(file.getInputStream(), filePath);
                    savedFiles.add(filePath);

                    Attachment attachment = new Attachment();
                    attachment.setOriginalFileName(cleanOriginalName);
                    attachment.setStoredFileName(fileName);
                    attachment.setFileUrl(dir + fileName);
                    attachment.setFileSize((int) file.getSize());
                    attachment.setUser(project.getOwner());
                    attachment.setResourceType(AttachmentResource.PROJECT);
                    attachment.setResourceId(project.getId());
                    attachment.setIsDeleted(false);
                    attachment.setUploadAt(LocalDateTime.now());

                    newAttachments.add(attachment);
                }
            }

            // 6. Lưu file mới vào DB và trả về
            if (!newAttachments.isEmpty()) {
                return new HashSet<>(attachmentRepo.saveAll(newAttachments));
            }

            return Collections.emptySet();

        } catch (Exception e) {
            // Rollback các file vật lý đã copy thành công nếu xảy ra lỗi
            for (Path path : savedFiles) {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException ignored) {
                }
            }
            throw new RuntimeException("Lỗi trong quá trình lưu file đính kèm: " + e.getMessage(), e);
        }
    }
}