package com.example.quanlycongviec.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.quanlycongviec.DTO.Response.ProjectRes;
import com.example.quanlycongviec.DTO.Response.TaskRes;
import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Entity.list.ProjectStatus;
import com.example.quanlycongviec.Entity.list.TaskStatus;
import com.example.quanlycongviec.Mapper.ProjectMap;
import com.example.quanlycongviec.Repository.UserRepo;
import lombok.RequiredArgsConstructor;

@Service // Chỉ giữ lại @Service, BỎ HOÀN TOÀN @SpringBootApplication
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
   private final ProjectMap projectMap;

    public User findById(int id) {
        // Dùng .orElse(null) để bóc tách dữ liệu từ Optional ra Object NguoiDung 
        // Nếu không tìm thấy id=1 trong DB, nó sẽ trả về null thay vì crash ứng dụng
        return userRepo.findById(id).orElse(null);
    }
     public Page<ProjectRes> getAllProject(String keyword, ProjectStatus projectStatus,Integer ngId,Pageable pageable){
        if (keyword != null && !keyword.isEmpty()) {
            keyword = "%" + keyword + "%";
        } else {
            keyword = null;
        }
        // if (projectStatus != null) {
        //     trangThaiCongViec=null;
        // }
         if (ngId != null && ngId <= 0) {
            ngId = null;
        }
        return userRepo.findProjectByUser(keyword,projectStatus,ngId,pageable).map(pj->projectMap.toProjectRes(pj));
    }

    

}