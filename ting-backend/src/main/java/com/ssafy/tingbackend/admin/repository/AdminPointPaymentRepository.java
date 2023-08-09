package com.ssafy.tingbackend.admin.repository;

import com.ssafy.tingbackend.entity.payment.PointPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminPointPaymentRepository extends JpaRepository<PointPayment, Long> {

    @Query("SELECT p FROM PointPayment p JOIN FETCH p.pointCode WHERE p.createdTime >= :dateTime AND p.aid is not null ORDER BY p.createdTime ASC")
    List<PointPayment> findPaymentHistory(@Param("dateTime") LocalDateTime dateTime);

    @Query("SELECT SUM(p.pointCode.totalAmount) FROM PointPayment p WHERE p.aid is not null")
    Long findTotalProfit();
}
