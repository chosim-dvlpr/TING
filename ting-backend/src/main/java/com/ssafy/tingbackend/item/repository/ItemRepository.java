package com.ssafy.tingbackend.item.repository;

import com.ssafy.tingbackend.entity.item.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
