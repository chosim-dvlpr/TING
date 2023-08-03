package com.ssafy.tingbackend.date.repository;

import com.ssafy.tingbackend.entity.matching.Question;
import com.ssafy.tingbackend.entity.type.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAllByCategory(QuestionType category);
    @Query("SELECT q FROM Question q WHERE q.category = :essential OR q.category = :random")
    List<Question> findAllCard(@Param("essential") QuestionType essential, @Param("random") QuestionType random);
}
