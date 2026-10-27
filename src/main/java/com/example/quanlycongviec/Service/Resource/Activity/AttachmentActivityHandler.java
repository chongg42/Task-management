package com.example.quanlycongviec.Service.Resource.Activity;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.aspectj.lang.JoinPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.AOP.TrackActivity;
import com.example.quanlycongviec.Entity.ActivityLog;
import com.example.quanlycongviec.Entity.Attachment;
import com.example.quanlycongviec.Entity.Project;
import com.example.quanlycongviec.Repository.ActivityRepo;
import com.example.quanlycongviec.Repository.AttachmentRepo;
import com.example.quanlycongviec.Utils.AOPUtils;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AttachmentActivityHandler implements ActivityResourceHandler {

    private final AttachmentRepo attachmentRepo;
    private final ActivityRepo activityRepo;

    @Override
    public String getResource() {
        return "FILE";
    }

    @Override
    public Map<Integer, Map<String, Object>> getMetadata(Set<Integer> resourceIds) {

        if (resourceIds == null || resourceIds.isEmpty()) {
            return Map.of();
        }

        List<Attachment> attachments = attachmentRepo.findAllByresourceIdIn(resourceIds);

        return attachments.stream()
                .collect(Collectors.toMap(
                        Attachment::getId,
                        attachment -> {
                            Map<String, Object> metadata = new HashMap<>();
                            metadata.put("attachmentId", attachment.getId());
                            metadata.put("fileName", attachment.getOriginalFileName());
                            metadata.put("fileSize", attachment.getFileSize());
                            metadata.put("storedFileName", attachment.getStoredFileName());
                            return metadata;
                        }));
    }

    @Override
    public ActivityLog buildLogs(JoinPoint joinPoint, TrackActivity annotation, String status, Object result) {

        MultipartFile[] files = AOPUtils.findArgument(joinPoint.getArgs(), MultipartFile[].class);
        if(files ==null){
            return null;
        }
        // Gom tên các file lại: "file1.png, file2.pdf"
        List<String> fileNames = Arrays.stream(files)
                .filter(f -> !f.isEmpty())
                .map(MultipartFile::getOriginalFilename)
                .toList();
        Project project = AOPUtils.findArgument((joinPoint.getArgs()), Project.class);
        String actionDesc = "Đã tải lên " + fileNames.size() + " file: " + String.join(",", fileNames);
       
        Integer resourceId =(result instanceof Attachment attachment)?attachment.getResourceId():project.getId();
        String resource=(result instanceof Attachment attachment)?attachment.getResourceType().toString():"PROJECT";
        ActivityLog log = ActivityLog.builder()
                .resource(resource)
                .resourceId(resourceId)
                .action(annotation.action())
                .description(actionDesc)
                .status(status)
                .projectId(project.getId())
                .build();
        return activityRepo.save(log);
    }
}
