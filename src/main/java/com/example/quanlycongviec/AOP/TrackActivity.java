package com.example.quanlycongviec.AOP;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD) // Chỉ áp dụng trên method (hàm)
@Retention (RetentionPolicy.RUNTIME) //// Có hiệu lực khi ứng dụng đang chạy
public @interface TrackActivity {
   String action() default "";      // VD: "UPDATE_TASK", "CREATE_PROJECT"
    String resource() default "";    // VD: "TASK", "PROJECT"
    String description() default "";
}
