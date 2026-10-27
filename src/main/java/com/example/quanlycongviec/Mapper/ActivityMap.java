// package com.example.quanlycongviec.Mapper;


// import java.util.HashMap;

// import java.util.Map;


// import org.springframework.stereotype.Component;


// import com.example.quanlycongviec.DTO.Response.ActivityRes;
// import com.example.quanlycongviec.DTO.Response.UserRes;

// import com.example.quanlycongviec.Entity.ActivityLog;

// import com.example.quanlycongviec.Repository.AttachmentRepo;
// import com.example.quanlycongviec.Repository.TaskRepo;

// import lombok.RequiredArgsConstructor;


// @Component
// @RequiredArgsConstructor
// public class ActivityMap {

//     private final TaskRepo taskRepository;
//     private final UserMap userMap;
//     private final AttachmentRepo attachmentRepo;
//     public ActivityRes toResponse(ActivityLog log) {
//         // 1. Map User
//         UserRes userRes = null;
//         if (log.getUser() != null) {
//             userRes = userMap.toUserRes(log.getUser());
//         }

//         // 3. Trả về ActivityRes hoàn chỉnh
//         return ActivityRes.builder()
//                 .id(log.getId())
//                 .resource(log.getResource())
//                 .action(log.getAction())
//                 .description(log.getDescription())
//                 .status(log.getStatus())
//                 .projectId(log.getProjectId())
//                 .createdAt(log.getCreatedAt())
//                 .user(userRes)
//                 .metadata(getMetaData(log.getResource(),log.getResourceId()))
//                 .build();
//     }
//     public Map<String, Object> getMetaData(String resource,Integer resourceId){
//         Map<String, Object> metadata = new HashMap<>();
//         if (resourceId == null || resource == null) {
//         return metadata;
//     }
//         if ("TASK".equalsIgnoreCase(resource)) {
//         taskRepository.findById(resourceId).ifPresent(task -> {
//             metadata.put("taskId", task.getId());
//             metadata.put("taskTitle", task.getTitle());
//             metadata.put("status", task.getStatus());
//         });
//     } else if ("ATTACHMENT".equalsIgnoreCase(resource)) {
//         attachmentRepo.findById(resourceId).ifPresent(att -> {
//             metadata.put("fileId", att.getId());
//             metadata.put("fileName", att.getOriginalFileName());
//         });
//     }
       
//         return metadata;
//     }
// }
