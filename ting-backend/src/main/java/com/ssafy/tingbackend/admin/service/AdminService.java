package com.ssafy.tingbackend.admin.service;

import com.ssafy.tingbackend.admin.dto.AdminLoginLogDto;
import com.ssafy.tingbackend.admin.dto.AdminReportDto;
import com.ssafy.tingbackend.admin.repository.AdminLoginLogRepository;
import com.ssafy.tingbackend.admin.repository.AdminReportRepository;
import com.ssafy.tingbackend.common.dto.PageResult;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.Report;
import com.ssafy.tingbackend.entity.user.LoginLog;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final AdminReportRepository reportRepository;
    private final UserRepository userRepository;
    private final AdminLoginLogRepository loginLogRepository;

    public Map<String, Object> getReportList(PageRequest pageRequest) {
        Page<Report> reportList = reportRepository.findAll(pageRequest);

        PageResult pageResult = new PageResult(
                reportList.getNumber(),
                reportList.getSize(),
                (int) reportList.getTotalElements(),
                reportList.getTotalPages(),
                reportList.isFirst(),
                reportList.isLast()
        );

        List<AdminReportDto> adminReportDtoList = new ArrayList<>();
        reportList.map(report -> adminReportDtoList.add(AdminReportDto.of(report)));

        return Map.of(
                "reportList", adminReportDtoList,
                "pageResult", pageResult
        );
    }

    @Transactional
    public AdminReportDto getReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new CommonException(ExceptionType.REPORT_NOT_FOUND));
        return AdminReportDto.of(report);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        // soft 삭제
        userRepository.softDeleteUser(user.getId(), LocalDateTime.now());
    }

    public Map<String, Object> getLoginLogList(PageRequest pageRequest) {
        Page<LoginLog> loginLogList = loginLogRepository.findAll(pageRequest);

        PageResult pageResult = new PageResult(
                loginLogList.getNumber(),
                loginLogList.getSize(),
                (int) loginLogList.getTotalElements(),
                loginLogList.getTotalPages(),
                loginLogList.isFirst(),
                loginLogList.isLast()
        );

        List<AdminLoginLogDto> loginLogDtoList = new ArrayList<>();
        loginLogList.map(loginLog -> loginLogDtoList.add(AdminLoginLogDto.of(loginLog)));

        return Map.of(
                "loginLogList", loginLogDtoList,
                "pageResult", pageResult
        );
    }
}
