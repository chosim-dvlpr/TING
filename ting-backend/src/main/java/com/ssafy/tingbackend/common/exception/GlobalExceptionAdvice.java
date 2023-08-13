package com.ssafy.tingbackend.common.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.ssafy.tingbackend.common.response.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
@ResponseStatus(code = HttpStatus.BAD_REQUEST)
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

    @ExceptionHandler(IllegalArgumentException.class)
    public CommonResponse illegalArgumentExceptionHandler(IllegalArgumentException e) {
        e.printStackTrace();
        log.error("illegal argument exception occurred: {}", e.getMessage());

        return new CommonResponse(400, "잘못된 인자가 전달되었습니다.");
    }

    @ExceptionHandler(InvalidFormatException.class)
    public CommonResponse invalidFormatException(InvalidFormatException e) {
        e.printStackTrace();
        log.error("invalid format exception occurred: {}", e.getMessage());

        return new CommonResponse(400, "잘못된 형식의 데이터가 전달되었습니다.");
    }

    @ExceptionHandler(Exception.class)
    public CommonResponse globalExceptionHandler(Exception e) {
        /* for Debugging */
        e.printStackTrace();
        log.error("global exception occurred: {}", e.getMessage());

        return new CommonResponse(4000,
                "global exception 발생 (알 수 없는 오류), message: " + e.getMessage() + " exception type: " + e.getClass());
    }

}
