package com.ssafy.tingbackend.date.repository;

import com.ssafy.tingbackend.entity.matching.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
