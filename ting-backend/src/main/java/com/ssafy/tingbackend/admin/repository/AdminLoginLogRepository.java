package com.ssafy.tingbackend.admin.repository;

import com.ssafy.tingbackend.entity.user.LoginLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminLoginLogRepository extends JpaRepository<LoginLog, Long> {
}
