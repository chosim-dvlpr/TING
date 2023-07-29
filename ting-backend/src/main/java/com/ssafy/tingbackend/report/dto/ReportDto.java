package com.ssafy.tingbackend.report.dto;

import com.ssafy.tingbackend.entity.Report;
import com.ssafy.tingbackend.entity.type.ReportStateType;
import com.ssafy.tingbackend.entity.type.ReportType;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReportDto {
    private Long reportId;
    private Long userId;
    private String content;
    private ReportStateType state;
    private ReportType type;
    private Long typeId;
    private LocalDateTime createdTime;

    public static ReportDto of(Report report) {
        return ReportDto.builder()
                .reportId(report.getId())
                .userId(report.getUser().getId())
                .content(report.getContent())
                .state(report.getState())
                .type(report.getType())
                .typeId(report.getTypeId())
                .createdTime(report.getCreatedTime())
                .build();
    }

}
