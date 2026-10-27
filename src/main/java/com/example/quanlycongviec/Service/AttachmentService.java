package com.example.quanlycongviec.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.Controller.AOP.TrackActivity;
import com.example.quanlycongviec.DTO.Response.AttachmentRes;
import com.example.quanlycongviec.Entity.Attachment;
import com.example.quanlycongviec.Entity.Project;
import com.example.quanlycongviec.Mapper.AttachmentMap;
import com.example.quanlycongviec.Repository.AttachmentRepo;
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

    @TrackActivity(action = "UPLOAD_ATTACHMENT",resource = "ATTACHMENT")
    public Attachment creaAttachment(MultipartFile file) {
        Path upPath = Paths.get(dir);

        try {
            if (!Files.exists(upPath))
                Files.createDirectories(upPath);
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = upPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            Attachment attachment = new Attachment();
            attachment.setOriginalFileName(file.getOriginalFilename());
            attachment.setStoredFileName(fileName);
            attachment.setFileUrl(dir + fileName);
            attachment.setFileSize((int) file.getSize());
            attachment.setIsDeleted(false);
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
      @TrackActivity(action = "cập nhập file ", resource = "FILE")
    public void saveAttachments(Project project, MultipartFile[] files) {
        if (files == null || files.length == 0)
            return;
        Set<Path> savedFiles = new HashSet<>();
        Set<Attachment> attachmentList = new HashSet<>();
        Set<Attachment> attachmentsToSoftDelete = new HashSet<>();
        Path upPath = Paths.get(dir);

        try {
            if (!Files.exists(upPath)) {
                Files.createDirectories(upPath);
            }
            List<MultipartFile> validFiles = Arrays.stream(files).filter(file -> file != null && !file.isEmpty())
                    .collect(Collectors.toList());
            if (validFiles.isEmpty())
                return;
            // tên file gửi lên
            Set<String> originalNames = validFiles.stream()
                    .map(file -> Paths.get(file.getOriginalFilename()).getFileName().toString())
                    .collect(Collectors.toSet());

            Set<Attachment> attachments = attachmentRepo
                    .findAllByProjectIdAndIsDeletedFalse(project.getId());
            for (Attachment attachment : attachments) {
                if (!originalNames.contains(attachment.getOriginalFileName())) {
                    attachment.setIsDeleted(true);
                    attachmentsToSoftDelete.add(attachment);
                }

            }
            // lấy tên file đã lưu trong db
            Set<String> activeExistingNames = attachments.stream()
                    .map(file -> file.getOriginalFileName()).collect(Collectors.toSet());

            for (MultipartFile file : validFiles) {
                String cleanOriginalName = Paths.get(file.getOriginalFilename()).getFileName().toString();
                if (!activeExistingNames.contains(cleanOriginalName)) {
                    String fileName = UUID.randomUUID() + "_" + cleanOriginalName;
                    Path filePath = upPath.resolve(fileName);// tạo đường dẫn file vd upPath\filename
                    Files.copy(file.getInputStream(), filePath);// coppy nội dung từ file vào filePath
                    savedFiles.add(filePath);
                    Attachment attachment = new Attachment();
                    attachment.setOriginalFileName(cleanOriginalName);
                    attachment.setStoredFileName(fileName);
                    attachment.setFileUrl(dir + fileName);
                    attachment.setFileSize((int) file.getSize());
                    attachment.setUser(project.getOwner());
                    attachment.setProject(project);
                    attachment.setIsDeleted(false);
                    attachmentList.add(attachment);
                }

            }
            if (!attachmentList.isEmpty()) {
                attachmentRepo.saveAll(attachmentList);
            }
            if (!attachmentsToSoftDelete.isEmpty()) {
                attachmentRepo.saveAll(attachmentsToSoftDelete);
            }
            // project.setAttachments(attachments);
        } catch (Exception e) {
            // TODO: handle exception
            // xóa toàn bộ file vật lý đã copy thành công trước đó để tránh rác ổ cứng
            for (Path path : savedFiles) {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException ex) {
                    // TODO: handle exception

                }

            }
            throw new RuntimeException("Lỗi trong quá trình lưu file đính kèm: " + e.getMessage(), e);
        }
    }

}
