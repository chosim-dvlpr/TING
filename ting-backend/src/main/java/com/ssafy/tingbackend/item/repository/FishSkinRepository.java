package com.ssafy.tingbackend.item.repository;

import com.ssafy.tingbackend.entity.item.FishSkin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FishSkinRepository extends JpaRepository<FishSkin, Long> {

    @Query(value = "SELECT * FROM fish_skin where code < 1000 ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<FishSkin> findByRandomFishSkin();
}
