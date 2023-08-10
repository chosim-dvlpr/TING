package com.ssafy.tingbackend.item.repository;

import com.ssafy.tingbackend.entity.item.Inventory;
import com.ssafy.tingbackend.entity.type.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByItemType(ItemType itemType);

    @Query("select i from Inventory i where i.user.id = :userId")
    List<Inventory> findByUserId(@Param("userId") Long userId);

    Optional<Inventory> findByUserIdAndItemType(Long id, ItemType itemType);
}
