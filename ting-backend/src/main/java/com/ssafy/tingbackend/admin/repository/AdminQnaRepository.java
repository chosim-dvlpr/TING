package com.ssafy.tingbackend.admin.repository;

import com.ssafy.tingbackend.entity.QnA;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdminQnaRepository extends JpaRepository<QnA, Long> {

}
