package com.ssafy.tingbackend.user.repository;

import com.ssafy.tingbackend.user.dto.PhoneNumberAuthDto;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PhoneNumberAuthRepository extends MongoRepository<PhoneNumberAuthDto, String> {
   Optional<PhoneNumberAuthDto> findByPhoneNumber(String phoneNumber);
}
