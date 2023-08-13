package com.ssafy.tingbackend.item.controller;

import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.item.dto.InventoryDto;
import com.ssafy.tingbackend.item.dto.ItemDto;
import com.ssafy.tingbackend.item.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ItemController {

    private final ItemService itemService;

    /**
     * 아이템 구매
     */
    @GetMapping("/item/{itemCode}/{count}")
    public CommonResponse buyItem(Principal principal, @PathVariable Long itemCode, @PathVariable Integer count) {
        itemService.buyItem(Long.parseLong(principal.getName()), itemCode, count);
        return new CommonResponse(200, "아이템 구매 성공");
    }

    /**
     * 보유 아이템 목록 조회
     */
    @GetMapping("/item/user")
    public DataResponse<ItemDto.OwnItem> getOwnItemList(Principal principal) {
        List<InventoryDto> ownItemList = itemService.getOwnItemList(Long.parseLong(principal.getName()));

        return new DataResponse(200, "보유 아이템 목록 조회 성공", ownItemList);
    }

    /**
     * 상점 아이템 목록 조회
     */
    @GetMapping("/item")
    public DataResponse<ItemDto.Basic> getStoreItemList() {
        List<ItemDto.Basic> storeItemList = itemService.getStoreItemList();
        return new DataResponse(200, "상점 아이템 목록 조회 성공", storeItemList);
    }

    /**
     * 아이템 사용
     */
    @PutMapping("/item/{inventoryId}")
    public CommonResponse useItem(Principal principal, @PathVariable Long inventoryId) {
        itemService.useItem(Long.parseLong(principal.getName()), inventoryId);
        return new CommonResponse(200, "아이템 사용 성공");
    }

    /**
     * 티켓 사용
     */
    @PutMapping("/item/ticket")
    public CommonResponse useTicket(Principal principal) {
        itemService.useTicket(Long.parseLong(principal.getName()));
        return new CommonResponse(200, "티켓 사용 성공");
    }

    /**
     * 물고기 스킨 랜덤박스 사용
     */
    @PutMapping("/item/fishRandomBox")
    public DataResponse<ItemDto.FishSkinDto> useFishSkin(Principal principal) {
        ItemDto.FishSkinDto fishSkinDto = itemService.useFishRandomBox(Long.parseLong(principal.getName()));
        return new DataResponse(200, "물고기 랜덤박스 사용 성공", fishSkinDto);
    }

    /**
     * 닉네임 변경권 사용
     */
    @PutMapping("/item/changeNickname")
    public DataResponse<String> changeNickname(Principal principal, @RequestBody Map<String, String> json) {
        itemService.changeNickname(Long.parseLong(principal.getName()), json.get("nickname"));
        return new DataResponse(200, "닉네임 변경 성공", json.get("nickname"));
    }

    /**
     * 물고기 부활 티켓 사용
     */
    @PutMapping("/item/reviveFish/{chattingId}")
    public CommonResponse reviveFish(Principal principal, @PathVariable Long chattingId) {
        itemService.reviveFish(Long.parseLong(principal.getName()), chattingId);
        return new CommonResponse(200, "물고기 부활 성공");
    }
}
