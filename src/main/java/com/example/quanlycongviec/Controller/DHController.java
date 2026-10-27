package com.example.quanlycongviec.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DHController {
    @GetMapping("/")
    public String home() {
        return "tongQuan";
    }

    @GetMapping("/tongquan")
    public String dashboard() {
        return "tongQuan";
    }

    @GetMapping("/congviec")
    public String project() {
        return "congViec";
    }

    @GetMapping("/lichtrinh")
    public String lich() {
        return "lich";
    }

    @GetMapping({ "/duan", "/duan/{id}" })
    public String duAn() {
       
            return "duAn";

    }

    @GetMapping("/projectdetail/{id}")
    public String projectDetail(@PathVariable("id") Integer id) {

        return "projectDetail"; // Trả về file giao diện projectDetail.html của bạn
    }

    @GetMapping("/caidat")
    public String caiDat() {
        return "caiDat";
    }

}
