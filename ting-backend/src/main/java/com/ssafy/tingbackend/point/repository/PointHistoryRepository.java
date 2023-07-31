package com.ssafy.tingbackend.point.repository;

import com.ssafy.tingbackend.entity.point.PointHistory;
import com.ssafy.tingbackend.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {
    @Query("SELECT p FROM PointHistory p WHERE p.user.id=:userId")
    Page<PointHistory> findByUser(Pageable pageable, Long userId);
}
