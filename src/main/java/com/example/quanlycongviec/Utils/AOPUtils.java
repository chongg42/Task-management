package com.example.quanlycongviec.Utils;

import lombok.experimental.UtilityClass;

@UtilityClass
public class AOPUtils {
    @SuppressWarnings("unchecked")
    public static <T> T findArgument(Object[] args, Class<T> clazz) {
        if (args == null)
            return null;
        for (Object arg : args) {
            if (clazz.isInstance(arg))
                return (T) arg;
        }
        return null;
    }
}
