package com.ssafy.tingbackend.admin.repository;

import com.ssafy.tingbackend.entity.matching.Matching;
import com.ssafy.tingbackend.entity.user.LoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminMatchingRepository extends JpaRepository<Matching, Long> {

    @Query("SELECT m FROM Matching m WHERE m.createdTime >= :dateTime AND m.isSuccess = true ORDER BY m.createdTime ASC")
    List<Matching> findMatchingHistory(LocalDateTime dateTime);

    @Query("SELECT COUNT(m) FROM Matching m WHERE m.isSuccess = true")
    Integer findMatchingCount();
}
