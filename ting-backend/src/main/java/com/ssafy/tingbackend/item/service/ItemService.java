package com.ssafy.tingbackend.item.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.chatting.ChattingUser;
import com.ssafy.tingbackend.entity.item.FishSkin;
import com.ssafy.tingbackend.entity.item.Inventory;
import com.ssafy.tingbackend.entity.item.Item;
import com.ssafy.tingbackend.entity.item.UserItem;
import com.ssafy.tingbackend.entity.point.PointHistory;
import com.ssafy.tingbackend.entity.type.ChattingType;
import com.ssafy.tingbackend.entity.type.ItemType;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.friend.dto.ChattingMessageDto;
import com.ssafy.tingbackend.friend.repository.ChattingMessageRepository;
import com.ssafy.tingbackend.friend.repository.ChattingRepository;
import com.ssafy.tingbackend.friend.repository.ChattingUserRepository;
import com.ssafy.tingbackend.item.dto.InventoryDto;
import com.ssafy.tingbackend.item.dto.ItemDto;
import com.ssafy.tingbackend.item.repository.FishSkinRepository;
import com.ssafy.tingbackend.item.repository.InventoryRepository;
import com.ssafy.tingbackend.item.repository.ItemRepository;
import com.ssafy.tingbackend.item.repository.UserItemRepository;
import com.ssafy.tingbackend.point.repository.PointCategoryRepository;
import com.ssafy.tingbackend.point.repository.PointHistoryRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ItemService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final UserItemRepository userItemRepository;
    private final InventoryRepository inventoryRepository;
    private final PointHistoryRepository pointHistoryRepository;
    private final PointCategoryRepository pointCategoryRepository;
    private final FishSkinRepository fishSkinRepository;
    private final ChattingUserRepository chattingUserRepository;
    private final ChattingRepository chattingRepository;
    private final ChattingMessageRepository chattingMessageRepository;

    @Transactional
    public void buyItem(Long userId, Long itemCode, Integer count) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Item item = itemRepository.findById(itemCode)
                .orElseThrow(() -> new CommonException(ExceptionType.ITEM_NOT_FOUND));

        if (item.getPrice() * count > user.getPoint()) {
            throw new CommonException(ExceptionType.POINT_NOT_ENOUGH);
        }

        // 아이템 가격만큼 사용자 포인트 차감
        user.setPoint(user.getPoint() - item.getPrice() * count);

        // 포인트 사용내역 등록
        PointHistory pointHistory = new PointHistory();
        pointHistory.setUser(user);
        pointHistory.setResultPoint(user.getPoint());
        pointHistory.setChangeCost(item.getPrice() * count);
        pointHistory.setPointCategory(pointCategoryRepository.findById(2L).orElseThrow());
        pointHistoryRepository.save(pointHistory);


        // 아이템이 SKIN 일 때 이미 더 큰 크기의 SKIN 을 가지고 있다면 에러 던져주기
        Set<ItemType> typeSet = new HashSet<>(Set.of(ItemType.SKIN_2, ItemType.SKIN_3, ItemType.SKIN_5, ItemType.SKIN_10));

        ItemType maxSkinSize = findMaxSkinSize(userId);
        if (typeSet.contains(item.getCategory()) && item.getCategory().ordinal() <= maxSkinSize.ordinal()) {
            throw new CommonException(ExceptionType.ITEM_ALREADY_HAVE);
        }

        // 아이템 구매 내역 저장
        for (int i = 0; i < count; i++) {
            UserItem userItem = UserItem.builder()
                    .user(user)
                    .item(item)
                    .build();
            userItemRepository.save(userItem);

            // 인벤토리에 아이템 등록
            Inventory inventory = inventoryRepository.findByItemTypeAndUserId(item.getCategory(), user.getId())
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
    }

    private ItemType findMaxSkinSize(Long userId) {
        List<Inventory> inventoryList = inventoryRepository.findByUserId(userId);

        ItemType[] itemType = {ItemType.SKIN_10, ItemType.SKIN_5, ItemType.SKIN_3, ItemType.SKIN_2};

        for (ItemType type : itemType) {
            for (Inventory inventory : inventoryList) {
                if (inventory.getItemType() == type) {
                    return type;
                }
            }
        }
        return ItemType.SKIN_2;
    }

    @Transactional
    public List<InventoryDto> getOwnItemList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        List<Inventory> inventory = inventoryRepository.findByUserId(user.getId());

        List<InventoryDto> inventoryDtoList = new ArrayList<>();

        inventory.forEach(i -> {
            if (i.getQuantity() > 0) inventoryDtoList.add(InventoryDto.of(i));
        });

        ItemType[] itemType = {ItemType.SKIN_10, ItemType.SKIN_5, ItemType.SKIN_3, ItemType.SKIN_2};

        InventoryDto inventoryDto = null;
        for (ItemType type : itemType) {
            for (int i = 0; i < inventoryDtoList.size(); i++) {
                if (inventoryDtoList.get(i).getItemType() == type) {
                    if (inventoryDto == null) {
                        inventoryDto = inventoryDtoList.get(i);
                    }
                    inventoryDtoList.remove(i--);
                }
            }
        }

        inventoryDtoList.add(inventoryDto);

        return inventoryDtoList;
    }

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

    @Scheduled(cron = "0 0 7 * * *", zone = "Asia/Seoul")  // 매일 7시에 모든 사용자의 무료 티켓 3장으로 세팅
    @Async
    @Transactional
    public void updateFreeTicket() {
        List<User> allUsers = userRepository.findAllUsers();

        userLoop:
        for (User user : allUsers) {
            List<Inventory> inventoryList = inventoryRepository.findByUserId(user.getId());
            int quantity = (user.getGender().equals("M")) ? 3 : 5;

            for (Inventory inventory : inventoryList) {
                if (inventory.getItemType() == ItemType.FREE_MATCHING_TICKET) {
                    inventory.setQuantity(quantity);
                    inventoryRepository.save(inventory);
                    continue userLoop;
                }

            }

            Inventory freeTicketInventory = Inventory.builder()
                    .user(user)
                    .quantity(quantity)
                    .itemType(ItemType.FREE_MATCHING_TICKET)
                    .build();
            inventoryRepository.save(freeTicketInventory);
        }

        log.info("무료 매칭 티켓 업데이트 완료 ({})", LocalDateTime.now());
    }

    @Transactional
    public ItemDto.FishSkinDto useFishRandomBox(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Inventory inventory = inventoryRepository.findByUserIdAndItemType(userId, ItemType.RANDOM_SKIN_BOX)
                .orElseThrow(() -> new CommonException(ExceptionType.ITEM_NOT_ENOUGH));

        // 아이템이 없을 경우 예외처리
        if (inventory.getQuantity() == 0) throw new CommonException(ExceptionType.ITEM_NOT_ENOUGH);

        // 아이템 사용
        inventory.setQuantity(inventory.getQuantity() - 1);

        // 스킨 랜덤뽑기 -> 뽑은 스킨이 유저의 스킨과 같을 경우 다시 뽑기
        FishSkin fishSkin = null;
        while (true) {
            // 랜덤뽑기 진행
            fishSkin = fishSkinRepository.findByRandomFishSkin()
                    .orElseThrow(() -> new CommonException(ExceptionType.SKIN_NOT_FOUND));

            if (fishSkin.getCode() != user.getFishSkin().getCode()) break;
        }

        // 뽑은 스킨을 유저에게 적용
        user.setFishSkin(fishSkin);

        inventoryRepository.save(inventory);
        userRepository.save(user);

        return ItemDto.FishSkinDto.of(fishSkin);
    }

    @Transactional
    public void changeNickname(Long userId, String nickname) {
        User user = userRepository.findByIdNotRemoved(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Inventory inventory = inventoryRepository.findByItemTypeAndUserId(ItemType.CHANGE_NICKNAME, userId)
                .orElseThrow(() -> new CommonException(ExceptionType.ITEM_NOT_ENOUGH));

        if (inventory.getQuantity() == 0) throw new CommonException(ExceptionType.ITEM_NOT_ENOUGH);

        inventory.setQuantity(inventory.getQuantity() - 1);
        inventoryRepository.save(inventory);

        user.setNickname(nickname);
        userRepository.save(user);
    }

    @Transactional
    public void reviveFish(Long userId, Long chattingId) {
        // 필요정보 조회 및 아이템 사용
        User user = userRepository.findByIdNotRemoved(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Inventory inventory = inventoryRepository.findByItemTypeAndUserId(ItemType.REVIVE_TICKET, userId)
                .orElseThrow(() -> new CommonException(ExceptionType.ITEM_NOT_ENOUGH));

        if (inventory.getQuantity() == 0) throw new CommonException(ExceptionType.ITEM_NOT_ENOUGH);

        inventory.setQuantity(inventory.getQuantity() - 1);
        inventoryRepository.save(inventory);

        // 어항에서 친구목록을 살리는 로직
        // 1. chatting 테이블의 state를 ALIVE로 변경, lastChattingTime을 현재 시간으로 변경 (DELETE 면 살릴 수 없음)
        // 2. mongodb의 채팅을 하나 추가 (살리는 사람의 id로 메시지 전송)
        // [ㅇㅇ(닉네임) 님이 좀 더 대화를 나누어보고 싶어하여 부활티켓을 사용하였습니다.]

        String nickname = user.getNickname();
        String reviveMessage = "[" + nickname + "님이 좀 더 대화를 나누어보고 싶어 부활티켓을 사용하였습니다.]";
        ChattingMessageDto chattingMessageDto = new ChattingMessageDto(chattingId, userId, reviveMessage, nickname);

        ChattingUser friendChattingUser = chattingUserRepository.findFriendChattingUser(chattingId, userId)
                .orElseThrow(() -> new CommonException(ExceptionType.CHATTING_USER_NOT_FOUND));

        Chatting chatting = chattingRepository.findById(chattingId)
                .orElseThrow(() -> new CommonException(ExceptionType.CHATTING_NOT_FOUND));

        if (chatting.getState() == ChattingType.DELETED) {
            throw new CommonException(ExceptionType.DELETED_FRIEND_NOT_REVIVE);
        } else if (chatting.getState() == ChattingType.ALIVE) {
            throw new CommonException(ExceptionType.ALIVE_FRIEND_NOT_REVIVE);
        }

        chatting.setState(ChattingType.ALIVE);
        chattingMessageRepository.save(chattingMessageDto);

        friendChattingUser.setUnread(friendChattingUser.getUnread() + 1);
        chatting.setLastChattingContent(reviveMessage);
        chatting.setLastChattingTime(LocalDateTime.now());
    }
}
