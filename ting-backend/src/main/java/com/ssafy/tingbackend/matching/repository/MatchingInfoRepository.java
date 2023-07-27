package com.ssafy.tingbackend.matching.repository;

import com.ssafy.tingbackend.matching.dto.MatchingInfoDto;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MatchingInfoRepository extends MongoRepository<MatchingInfoDto, String> {
    public MatchingInfoDto findBySessionId(String sessionId);
}
