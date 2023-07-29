package com.ssafy.tingbackend.report.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.Report;
import com.ssafy.tingbackend.entity.type.ReportStateType;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.report.dto.ReportDto;
import com.ssafy.tingbackend.report.repository.ReportRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public void report(ReportDto reportDto) {
        User user = userRepository.findById(reportDto.getUserId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Report report = Report.builder()
                .user(user)
                .state(ReportStateType.REGISTERD)
                .type(reportDto.getType())
                .typeId(reportDto.getTypeId())
                .content(reportDto.getContent())
                .build();

        reportRepository.save(report);
    }
}
