package com.ssafy.tingbackend.common.exception;

import com.ssafy.tingbackend.common.response.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionAdvice {

    @ExceptionHandler(CommonException.class)
    public CommonResponse commonExceptionHandler(CommonException e) {
        /* for Debugging */
        e.printStackTrace();
        log.error("common exception occurred: {}", e.getExceptionType().getMessage());

        return new CommonResponse(e.getExceptionType().getCode(), e.getExceptionType().getMessage());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public CommonResponse httpRequestMethodNotSupportedExceptionHandler(HttpRequestMethodNotSupportedException e) {
        /* for Debugging */
        e.printStackTrace();
        log.error("http request method not supported exception occurred: {}", e.getMessage());

        return new CommonResponse(400, e.getMethod() + " 메서드가 지원되지 않습니다.");
    }

    @ExceptionHandler(Exception.class)
    public CommonResponse globalExceptionHandler(Exception e) {
        /* for Debugging */
        e.printStackTrace();
        log.error("global exception occurred: {}", e.getMessage());

        return new CommonResponse(4000, "global exception 발생 (알 수 없는 오류)");
    }

}
