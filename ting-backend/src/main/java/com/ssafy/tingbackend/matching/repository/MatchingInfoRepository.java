package com.ssafy.tingbackend.matching.repository;

import com.ssafy.tingbackend.matching.dto.MatchingInfoDto;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MatchingInfoRepository extends MongoRepository<MatchingInfoDto, String> {
    public Optional<MatchingInfoDto> findBySocketSessionIdF(String socketSessionId);
    public Optional<MatchingInfoDto> findBySocketSessionIdM(String socketSessiobId);
}
