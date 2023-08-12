package com.ssafy.tingbackend.admin.repository;

import com.ssafy.tingbackend.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdminReportRepository extends JpaRepository<Report, Long> {

    @Query("SELECT COUNT(r) FROM Report r WHERE r.state = 'REGISTERD'")
    Integer findReportCount();
}
