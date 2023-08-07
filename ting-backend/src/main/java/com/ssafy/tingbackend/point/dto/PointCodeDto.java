package com.ssafy.tingbackend.point.dto;

import com.ssafy.tingbackend.entity.payment.PointCode;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointCodeDto {

    private Long pointCode;
    private String itemName;
    private int totalAmount;
    private int taxFreeAmount;

    public static PointCodeDto of(PointCode pointCode) {
        return PointCodeDto.builder()
                .pointCode(pointCode.getCode())
                .itemName(pointCode.getItemName())
                .totalAmount(pointCode.getTotalAmount())
                .taxFreeAmount(pointCode.getTaxFreeAmount())
                .build();
    }
}
