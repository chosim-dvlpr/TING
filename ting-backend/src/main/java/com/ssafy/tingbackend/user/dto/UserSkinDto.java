package com.ssafy.tingbackend.user.dto;

import com.ssafy.tingbackend.entity.item.Inventory;
import com.ssafy.tingbackend.entity.type.ItemType;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSkinDto {

    private Long userId;
    private String name;
    private ItemType itemType;

    public static UserSkinDto of(Inventory inventory) {
        return UserSkinDto.builder()
                .userId(inventory.getUser().getId())
                .name(inventory.getItemType().getName())
                .itemType(inventory.getItemType())
                .build();
    }
}
