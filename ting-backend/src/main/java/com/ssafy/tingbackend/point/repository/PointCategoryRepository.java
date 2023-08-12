package com.ssafy.tingbackend.point.repository;

import com.ssafy.tingbackend.entity.point.PointCategory;
import com.ssafy.tingbackend.entity.point.PointHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointCategoryRepository extends JpaRepository<PointCategory, Long> {
}
