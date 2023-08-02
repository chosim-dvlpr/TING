package com.ssafy.tingbackend.item.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.item.Item;
import com.ssafy.tingbackend.entity.item.UserItem;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.item.dto.ItemDto;
import com.ssafy.tingbackend.item.repository.ItemRepository;
import com.ssafy.tingbackend.item.repository.UserItemRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ItemService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final UserItemRepository userItemRepository;

    public void buyItem(Long userId, Long itemCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        Item item = itemRepository.findById(itemCode)
                .orElseThrow(() -> new CommonException(ExceptionType.ITEM_NOT_FOUND));

        UserItem userItem = UserItem.builder()
                .user(user)
                .item(item)
                .build();
        userItemRepository.save(userItem);
    }

    public List<ItemDto.OwnItem> getOwnItemList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        List<UserItem> userItemList = userItemRepository.findAllByUser(user);

        List<ItemDto.OwnItem> ownItemList = new ArrayList<>();
        outer:
        for(UserItem userItem : userItemList) {
            Item item = userItem.getItem();

            for(ItemDto.OwnItem ownItem : ownItemList) {
                if(ownItem.getCode().equals(item.getCode())) {
                    ownItem.addQuantity();
                    continue outer;
                }
            }

            ownItemList.add(ItemDto.OwnItem.of(item));
        }

        return ownItemList;
    }

    public List<ItemDto.Basic> getStoreItemList() {
        List<Item> itemEntityList = itemRepository.findAll();

        List<ItemDto.Basic> storeItemList = new ArrayList<>();
        for(Item itemEntity : itemEntityList) {
            storeItemList.add(ItemDto.Basic.of(itemEntity));
        }

        return storeItemList;
    }

    @Transactional
    public void useItem(Long userId, Long itemCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        Item item = itemRepository.findById(itemCode)
                .orElseThrow(() -> new CommonException(ExceptionType.ITEM_NOT_FOUND));

        // 같은 아이템이 여러개일 경우 고려하여 리스트로 받아오기
        List<UserItem> findItems = userItemRepository.findAllByUserAndItemAndIsUsedFalse(user, item);
        if(findItems.size() == 0) throw new CommonException(ExceptionType.USER_ITEM_NOT_FOUND);

        UserItem findItem = findItems.get(0);
        findItem.setUsed(true);
        findItem.setUsedTime(LocalDateTime.now());
    }
}
