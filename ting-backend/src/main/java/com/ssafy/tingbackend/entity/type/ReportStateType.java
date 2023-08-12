package com.ssafy.tingbackend.entity.type;

import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ReportStateType {
    REGISTERD("신고 접수"), PROCESSING("신고 검토"), PROCESSED("처리 완료");

    private String name;
}
