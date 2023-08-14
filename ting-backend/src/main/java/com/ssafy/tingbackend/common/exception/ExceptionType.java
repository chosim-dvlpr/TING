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
    PROFILE_FILE_NOT_FOUND(4101, "프로필 파일이 존재하지 않습니다."),
    PASSWORD_NOT_MATCH(4102, "아이디와 패스워드가 일치하지 않습니다."),
    DUPLICATED_NICKNAME(4103, "중복된 닉네임입니다."),

    ADDITOIONAL_INFO_NOT_FOUND(4200, "부가정보 코드가 존재하지 않습니다."),

    DUPLICATED_EMAIL(4300, "중복된 이메일입니다."),
    EMAIL_NOT_FOUND(4301, "존재하지 않는 이메일입니다."),
    EMAIL_CODE_NOT_MATCH(4302, "이메일 인증코드가 틀렸습니다."),
    EMAIL_SEND_FAIL(4303, "이메일 인증코드 전송에 실패하였습니다."),

    SMS_SEND_FAILED(4400, "인증코드 발송에 실패하였습니다."),
    PHONE_NUMBER_NOT_FOUND(4401, "존재하지 않는 전화번호입니다."),
    PHONE_AUTH_CODE_NOT_MATCH(4402, "전화번호 인증코드가 틀렸습니다."),

    QNA_NOT_FOUND(4700, "문의글이 존재하지 않습니다."),
    ADVICE_BOARD_NOT_FOUND(4500, "연애상담 글이 존재하지 않습니다."),
    ISSUE_BOARD_NOT_FOUND(4510, "이슈 글이 존재하지 않습니다."),
    COMMENT_NOT_FOUND(4520, "댓글이 존재하지 않습니다."),
    COMMENT_LIKE_NOT_FOUND(4521, "댓글 좋아요가 존재하지 않습니다."),

    QUESTION_NOT_FOUND(4800, "매칭 질문이 존재하지 않습니다."),
    MATCHING_TIME_OUT(4600, "매칭 대기 시간이 초과되었습니다."),
    OPENVIDU_ERROR(4601, "openvidu 실행 중 오류가 발생하였습니다."),
    MATCHING_NOT_FOUND(4602, "매칭이 존재하지 않습니다."),
    SOCKET_SESSION_NOT_FOUND(4603, "소켓 세션이 존재하지 않습니다."),
    MATCHING_CHOICE_TIME_OUT(4604, "최종 선택 시간이 초과되었습니다."),

    CHATTING_NOT_FOUND(4700, "채팅이 존재하지 않습니다."),
    CHATTING_USER_NOT_FOUND(4701, "채팅 유저가 존재하지 않습니다."),

    POINT_CATEGORY_NOT_FOUND(4800, "포인트 카테고리가 존재하지 않습니다."),
    ITEM_NOT_FOUND(4801, "아이템이 존재하지 않습니다."),
    USER_ITEM_NOT_FOUND(4802, "사용자가 해당 아이템을 보유하고 있지 않습니다."),

    POINT_CODE_NOT_EXIST(4900, "포인트 코드가 존재하지 않습니다."),
    KAKAO_READY_JSON_PARSE_EXCEPTION(4901, "카카오 결제 준비 응답 JSON 파싱에 실패하였습니다."),
    KAKAO_APPROVE_JSON_PARSE_EXCEPTION(4901, "카카오 결제 승인 응답 JSON 파싱에 실패하였습니다."),
    KAKAO_READY_API_FAIL_EXCEPTION(4902, "카카오 결제 준비 API 호출에 실패하였습니다."),
    KAKAO_APPROVE_API_FAIL_EXCEPTION(4902, "카카오 결제 승인 API 호출에 실패하였습니다."),
    POINT_PAYMENT_NOT_FOUND(4903, "포인트 결제 내역이 존재하지 않습니다."),

    REPORT_NOT_FOUND(4950, "신고 내역이 존재하지 않습니다"),
    POINT_NOT_ENOUGH(4970, "포인트가 부족합니다."),
    INVENTORY_NOT_FOUND(4971, "인벤토리가 존재하지 않습니다."),
    ITEM_NOT_ENOUGH(4972, "아이템이 존재하지 않습니다."),
    USER_INVENTORY_MISMATCH(4973, "사용자와 인벤토리가 일치하지 않습니다"),
    SKIN_NOT_FOUND(4974, "몰고기 스킨이 존재하지 않습니다."),
    DELETED_FRIEND_NOT_REVIVE(4975, "삭제된 친구는 티켓을 사용해도 부활시킬 수 없습니다."),
    ALIVE_FRIEND_NOT_REVIVE(4976, "죽은 친구에게만 티켓을 사용할 수 있습니다."),
    ITEM_ALREADY_HAVE(4977, "더 큰 어항크기 아이템을 이미 가지고 있습니다."),

    GLOBAL_EXCEPTION(5000, "알 수 없는 예외가 발생하습니다.");


    private final int code;
    private final String message;
}
