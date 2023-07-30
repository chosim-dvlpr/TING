package com.ssafy.tingbackend.admin.dto;

import com.ssafy.tingbackend.entity.user.LoginLog;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminLoginLogDto {

    private Long loginLogId;
    private Long userId;
    private LocalDateTime createdTime;

    public static AdminLoginLogDto of(LoginLog loginLog) {
        return AdminLoginLogDto.builder()
                .loginLogId(loginLog.getId())
                .userId(loginLog.getUser().getId())
                .createdTime(loginLog.getCreatedTime())
                .build();
    }
}
