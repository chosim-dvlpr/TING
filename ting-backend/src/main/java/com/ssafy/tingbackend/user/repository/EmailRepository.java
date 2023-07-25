package com.ssafy.tingbackend.user.repository;

import com.ssafy.tingbackend.user.dto.EmailAuthDto;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmailRepository extends MongoRepository<EmailAuthDto, String> {
   EmailAuthDto findByEmail(String email);

}
