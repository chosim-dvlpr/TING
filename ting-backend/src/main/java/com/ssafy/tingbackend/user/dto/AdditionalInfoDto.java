package com.ssafy.tingbackend.user.dto;

import com.ssafy.tingbackend.entity.type.AdditionalType;
import com.ssafy.tingbackend.entity.user.AdditionalInfo;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalInfoDto {
    private Long code;
    private AdditionalType category;
    private String name;

    public static AdditionalInfoDto of(AdditionalInfo additionalInfo) {
        if (additionalInfo == null) return null;

        return AdditionalInfoDto.builder()
                .code(additionalInfo.getCode())
                .category(additionalInfo.getCategory())
                .name(additionalInfo.getName())
                .build();
    }
}
