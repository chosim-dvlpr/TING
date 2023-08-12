package com.ssafy.tingbackend.item.repository;

import com.ssafy.tingbackend.entity.item.Item;
import com.ssafy.tingbackend.entity.item.UserItem;
import com.ssafy.tingbackend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserItemRepository extends JpaRepository<UserItem, Long> {
    @Query("SELECT ui FROM UserItem ui JOIN FETCH ui.item WHERE ui.user = :user AND ui.isUsed = false")
    List<UserItem> findAllByUser(@Param("user") User user);

    List<UserItem> findAllByUserAndItemAndIsUsedFalse(User user, Item item);
}
