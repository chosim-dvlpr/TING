package com.ssafy.tingbackend.admin.dto;

import com.ssafy.tingbackend.entity.Report;
import com.ssafy.tingbackend.entity.type.ReportStateType;
import com.ssafy.tingbackend.entity.type.ReportType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportDto {
    private Long reportId;
    private Long userId;
    private String content;
    private ReportStateType state;
    private ReportType type;
    private Long typeId;

    public static ReportDto of(Report report) {
        return ReportDto.builder()
                .reportId(report.getId())
                .userId(report.getUser().getId())
                .content(report.getContent())
                .state(report.getState())
                .type(report.getType())
                .typeId(report.getTypeId())
                .build();
    }
}
