package com.ssafy.tingbackend.admin.dto;

import com.ssafy.tingbackend.entity.Report;
import com.ssafy.tingbackend.entity.type.ReportStateType;
import com.ssafy.tingbackend.entity.type.ReportType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminReportDto {
    private Long reportId;
    private Long userId;
    private String userNickname;

    private Long reportedUserId;
    private String reportedUserNickname;

    private String content;
    private ReportStateType state;
    private ReportType type;
    private Long typeId;
    private String comment;
    private LocalDateTime createdTime;

    public static AdminReportDto of(Report report) {
        return AdminReportDto.builder()
                .reportId(report.getId())
                .userId(report.getUser().getId())
                .userNickname(report.getUser().getNickname())
                .content(report.getContent())
                .state(report.getState())
                .type(report.getType())
                .typeId(report.getTypeId())
                .createdTime(report.getCreatedTime())
                .comment(report.getComment())
                .build();
    }
}
