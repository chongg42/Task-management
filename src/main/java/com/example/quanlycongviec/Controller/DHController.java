    package com.example.quanlycongviec.Controller;

    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.GetMapping;

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
        @GetMapping("/duan")
        public String duAn() {
            return "duAn";
        }

        @GetMapping("/caidat")
        public String caiDat() {
            return "caiDat";
        }
    }
