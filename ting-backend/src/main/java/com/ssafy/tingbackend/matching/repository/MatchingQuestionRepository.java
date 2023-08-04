package com.ssafy.tingbackend.matching.repository;

import com.ssafy.tingbackend.entity.matching.Matching;
import com.ssafy.tingbackend.entity.matching.MatchingQuestion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchingQuestionRepository extends JpaRepository<MatchingQuestion, Long> {
    @EntityGraph(attributePaths = {"question"})
    List<MatchingQuestion> findByMatchingOrderByQuestionOrder(Matching matching);
}
