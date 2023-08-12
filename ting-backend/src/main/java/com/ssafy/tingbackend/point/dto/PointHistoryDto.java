package com.ssafy.tingbackend.point.dto;

import com.ssafy.tingbackend.entity.point.PointHistory;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointHistoryDto {
    private Long pointHistoryId;
    private String category;
    private Long changeCost;
    private Long resultPoint;
    private LocalDateTime changedTime;

    public static PointHistoryDto of(PointHistory pointHistory) {
        return PointHistoryDto.builder()
                .pointHistoryId(pointHistory.getId())
                .category(pointHistory.getPointCategory()==null? null: pointHistory.getPointCategory().getName())
                .changeCost(pointHistory.getChangeCost())
                .resultPoint(pointHistory.getResultPoint())
                .changedTime(pointHistory.getCreatedTime())
                .build();
    }
}
