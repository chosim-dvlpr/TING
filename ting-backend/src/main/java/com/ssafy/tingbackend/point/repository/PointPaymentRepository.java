package com.ssafy.tingbackend.point.repository;

import com.ssafy.tingbackend.entity.payment.PointPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointPaymentRepository extends JpaRepository<PointPayment, Long> {
}
