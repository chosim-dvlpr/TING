package com.ssafy.tingbackend.admin.repository;

import com.ssafy.tingbackend.entity.QnA;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminQnaRepository extends JpaRepository<QnA, Long> {
}
