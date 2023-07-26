package com.ssafy.tingbackend.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExceptionType {
    /**
     * CODE : 4자리 양의 정수 (맨 앞자리는 HTTP 상태코드의 앞 글자)
     * MESSAGE : 예외 메시지
     */

    JWT_TOKEN_EXPIRED(4000, "토큰이 만료되었습니다."),
    JWT_TOKEN_INVALID(4001, "토큰이 유효하지 않습니다."),
    JWT_TOKEN_PARSE_ERROR(4002, "토큰 파싱에 실패하였습니다."),

    USER_NOT_FOUND(4100, "존재하지 않는 유저입니다."),

    ADDITOIONAL_INFO_NOT_FOUND(4200, "부가정보 코드가 존재하지 않습니다."),

    DUPLICATED_EMAIL(4300, "중복된 이메일입니다."),
    EMAIL_NOT_FOUND(4301, "존재하지 않는 이메일입니다."),
    EMAIL_CODE_NOT_MATCH(4302, "이메일 인증코드가 틀렸습니다."),

    SMS_SEND_FAILED(4400, "인증코드 발송에 실패하였습니다."),

    GLOBAL_EXCEPTION(5000, "알 수 없는 예외가 발생하였습니다.");

    private final int code;
    private final String message;
}
