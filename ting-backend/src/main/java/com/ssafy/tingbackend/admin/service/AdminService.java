package com.ssafy.tingbackend.admin.service;

import com.ssafy.tingbackend.admin.dto.ReportDto;
import com.ssafy.tingbackend.admin.repository.AdminReportRepository;
import com.ssafy.tingbackend.common.dto.PageResult;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.Report;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final AdminReportRepository reportRepository;

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

        List<ReportDto> reportDtoList = new ArrayList<>();
        reportList.map(report -> reportDtoList.add(ReportDto.of(report)));

        return Map.of(
                "reportList", reportDtoList,
                "pageResult", pageResult
        );
    }

    public ReportDto getReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new CommonException(ExceptionType.REPORT_NOT_FOUND));
        return ReportDto.of(report);
    }
}
