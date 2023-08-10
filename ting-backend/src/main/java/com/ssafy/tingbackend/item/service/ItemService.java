package com.ssafy.tingbackend.item.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.item.Inventory;
import com.ssafy.tingbackend.entity.item.Item;
import com.ssafy.tingbackend.entity.item.UserItem;
import com.ssafy.tingbackend.entity.type.ItemType;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.item.dto.InventoryDto;
import com.ssafy.tingbackend.item.dto.ItemDto;
import com.ssafy.tingbackend.item.repository.InventoryRepository;
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
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ItemService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final UserItemRepository userItemRepository;
    private final InventoryRepository inventoryRepository;

    @Transactional
    public void buyItem(Long userId, Long itemCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Item item = itemRepository.findById(itemCode)
                .orElseThrow(() -> new CommonException(ExceptionType.ITEM_NOT_FOUND));

        if (item.getPrice() > user.getPoint()) {
            throw new CommonException(ExceptionType.POINT_NOT_ENOUGH);
        }

        // 아이템 가격만큼 사용자 포인트 차감
        user.setPoint(user.getPoint() - item.getPrice());

        // 아이템 구매 내역 저장
        UserItem userItem = UserItem.builder()
                .user(user)
                .item(item)
                .build();
        userItemRepository.save(userItem);

        // 인벤토리에 아이템 등록
        Inventory inventory = inventoryRepository.findByItemType(item.getCategory())
                .orElse(Inventory.builder()
                        .itemType(item.getCategory())
                        .user(user)
                        .quantity(0).build());

        // 매칭 티켓 아이템 부분일때
        if (item.getCode() == 1) {
            inventory.setQuantity(inventory.getQuantity() + 1);
        } else if (item.getCode() == 2) {
            inventory.setQuantity(inventory.getQuantity() + 3);
        } else if (item.getCode() == 3) {
            inventory.setQuantity(inventory.getQuantity() + 5);
        } else {
            inventory.setQuantity(inventory.getQuantity() + 1);
        }

        inventoryRepository.save(inventory);
    }

    @Transactional
    public List<InventoryDto> getOwnItemList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        List<Inventory> inventory = inventoryRepository.findByUserId(user.getId());


        List<InventoryDto> inventoryDtoList = new ArrayList<>();

        inventory.forEach(i -> inventoryDtoList.add(InventoryDto.of(i)));


        // 기본 제공 아이템
        Optional<Inventory> skin2 = inventoryRepository.findByUserIdAndItemType(user.getId(), ItemType.SKIN_2);
        if (skin2.isEmpty()) {
            Inventory skin2Inventory = Inventory.builder()
                    .user(user)
                    .itemType(ItemType.SKIN_2)
                    .quantity(1)
                    .build();
            inventoryRepository.save(skin2Inventory);
            inventoryDtoList.add(InventoryDto.of(skin2Inventory));
        }

        return inventoryDtoList;
    }

//    public List<ItemDto.OwnItem> getOwnItemList(Long userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
//        List<UserItem> userItemList = userItemRepository.findAllByUser(user);
//
//        List<ItemDto.OwnItem> ownItemList = new ArrayList<>();
//
//        outer:
//        for (UserItem userItem : userItemList) {
//            Item item = userItem.getItem();
//
//            for (ItemDto.OwnItem ownItem : ownItemList) {
//                if (ownItem.getCode().equals(item.getCode())) {
//                    ownItem.addQuantity();
//                    continue outer;
//                }
//            }
//
//            ownItemList.add(ItemDto.OwnItem.of(item));
//        }
//        return ownItemList;
//    }

    public List<ItemDto.Basic> getStoreItemList() {
        List<Item> itemEntityList = itemRepository.findAll();

        List<ItemDto.Basic> storeItemList = new ArrayList<>();
        for (Item itemEntity : itemEntityList) {
            storeItemList.add(ItemDto.Basic.of(itemEntity));
        }

        return storeItemList;
    }

    @Transactional
    public void useItem(Long userId, Long inventoryId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new CommonException(ExceptionType.INVENTORY_NOT_FOUND));

        // 인벤토리와 사용자가 일치하지 않을 경우 예외처리
        if (!Objects.equals(inventory.getUser().getId(), user.getId()))
            throw new CommonException(ExceptionType.USER_INVENTORY_MISMATCH);

        // 아이템 개수가 없을 경우 예외처리
        if (inventory.getQuantity() == 0) throw new CommonException(ExceptionType.ITEM_NOT_ENOUGH);

        inventory.setQuantity(inventory.getQuantity() - 1);

        inventoryRepository.save(inventory);
    }

    /**
     * 티켓 사용 로직
     */
    public void useTicket(Long userId) {
        List<Inventory> inventoryList = inventoryRepository.findByUserId(userId);

        for (Inventory inventory : inventoryList) {
            if (inventory.getItemType() == ItemType.FREE_MATCHING_TICKET) {
                if (inventory.getQuantity() > 0) {
                    inventory.setQuantity(inventory.getQuantity() - 1);
                    inventoryRepository.save(inventory);
                    return;
                }
            }
        }

        for (Inventory inventory : inventoryList) {
            if (inventory.getItemType() == ItemType.MATCHING_TICKET) {
                if (inventory.getQuantity() > 0) {
                    inventory.setQuantity(inventory.getQuantity() - 1);
                    inventoryRepository.save(inventory);
                    return;
                }
            }
        }

        throw new CommonException(ExceptionType.ITEM_NOT_ENOUGH);
    }
}
