package com.ssafy.tingbackend.common.config;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.mongodb.core.IndexOperations;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class TTLIndexConfigurer {
    private final MongoOperations mongoOperations;

    @Autowired
    public TTLIndexConfigurer(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    @PostConstruct
    public void initTTLIndex() {
//        IndexOperations indexOps = mongoOperations.indexOps("email");

        // 설정할 TTL 대상 필드를 "createdAt"으로 지정하고, TTL 소멸 시간은 1시간(3600초)로 설정합니다.
//        indexOps.ensureIndex(new org.springframework.data.mongodb.core.index.Index()
//                .on("createdAt", org.springframework.data.mongodb.core.index.IndexDirection.DESC)
//                .expire(10));
    }
}
