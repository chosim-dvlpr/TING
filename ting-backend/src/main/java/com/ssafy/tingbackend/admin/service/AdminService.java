package com.ssafy.tingbackend.admin.service;

import com.ssafy.tingbackend.admin.dto.AdminLoginLogDto;
import com.ssafy.tingbackend.admin.dto.AdminQnaDto;
import com.ssafy.tingbackend.admin.dto.AdminReportDto;
import com.ssafy.tingbackend.admin.repository.AdminLoginLogRepository;
import com.ssafy.tingbackend.admin.repository.AdminQnaRepository;
import com.ssafy.tingbackend.admin.repository.AdminReportRepository;
import com.ssafy.tingbackend.common.dto.PageResult;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.QnA;
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
    private final AdminQnaRepository qnaRepository;

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

    public Map<String, Object> getQnaList(PageRequest pageRequest) {
        Page<QnA> qnaList = qnaRepository.findAll(pageRequest);

        PageResult pageResult = new PageResult(
                qnaList.getNumber(),
                qnaList.getSize(),
                (int) qnaList.getTotalElements(),
                qnaList.getTotalPages(),
                qnaList.isFirst(),
                qnaList.isLast()
        );

        List<AdminQnaDto> adminQnaDtoList = new ArrayList<>();
        qnaList.map(qna -> adminQnaDtoList.add(AdminQnaDto.of(qna)));

        return Map.of(
                "qnaList", adminQnaDtoList,
                "pageResult", pageResult
        );
    }

    public AdminQnaDto getQna(Long qnaId) {
        QnA qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new CommonException(ExceptionType.QNA_NOT_FOUND));

        return AdminQnaDto.of(qna);
    }
}
