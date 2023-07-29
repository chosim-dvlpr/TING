package com.ssafy.tingbackend.admin.service;

import com.ssafy.tingbackend.admin.dto.ReportDto;
import com.ssafy.tingbackend.admin.repository.ReportRepository;
import com.ssafy.tingbackend.entity.Report;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final ReportRepository reportRepository;

    public List<ReportDto> getReportList(PageRequest pageRequest) {
        Page<Report> reportList = reportRepository.findAll(pageRequest);

        List<ReportDto> reportDtoList = new ArrayList<>();
        reportList.map(report -> reportDtoList.add(ReportDto.of(report)));
        return reportDtoList;
    }
}
