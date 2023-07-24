package com.ssafy.tingbackend.common.exception;

import com.ssafy.tingbackend.common.response.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionAdvice {

    @ExceptionHandler(Exception.class)
    public CommonResponse globalExceptionHandler(Exception e) {
        /* for Debugging */
        e.printStackTrace();
        log.error("global exception occurred: {}", e.getMessage());

        return new CommonResponse(4000, "global exception 발생 (알 수 없는 오류)");
    }

}
