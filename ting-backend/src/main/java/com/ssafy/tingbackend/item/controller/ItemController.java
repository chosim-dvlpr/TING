package com.ssafy.tingbackend.item.controller;

import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.item.dto.ItemDto;
import com.ssafy.tingbackend.item.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ItemController {

    private final ItemService itemService;

    @GetMapping("/item/{itemCode}")
    public CommonResponse buyItem(Principal principal, @PathVariable Long itemCode) {
        itemService.buyItem(Long.parseLong(principal.getName()), itemCode);
        return new CommonResponse(200, "아이템 구매 성공");
    }

    @GetMapping("/item/user")
    public DataResponse<ItemDto.OwnItem> getOwnItemList(Principal principal) {
        List<ItemDto.OwnItem> ownItemList =
                itemService.getOwnItemList(Long.parseLong(principal.getName()));
        return new DataResponse(200, "보유 아이템 목록 조회 성공", ownItemList);
    }

    @GetMapping("/item")
    public DataResponse<ItemDto.Basic> getStoreItemList() {
        List<ItemDto.Basic> storeItemList = itemService.getStoreItemList();
        return new DataResponse(200, "상점 아이템 목록 조회 성공", storeItemList);
    }

    @PutMapping("/item/{itemCode}")
    public CommonResponse useItem(Principal principal, @PathVariable Long itemCode) {
        itemService.useItem(Long.parseLong(principal.getName()), itemCode);
        return new CommonResponse(200, "아이템 사용 성공");
    }

}
