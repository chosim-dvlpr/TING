package com.ssafy.tingbackend.report.repository;

import com.ssafy.tingbackend.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

}
