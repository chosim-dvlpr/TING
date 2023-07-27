package com.ssafy.tingbackend.matching.repository;

import com.ssafy.tingbackend.entity.matching.Matching;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MatchingRepository extends JpaRepository<Matching, Long> {

}
