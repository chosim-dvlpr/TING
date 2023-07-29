package com.ssafy.tingbackend.admin.repository;

import com.ssafy.tingbackend.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminReportRepository extends JpaRepository<Report, Long> {
}
