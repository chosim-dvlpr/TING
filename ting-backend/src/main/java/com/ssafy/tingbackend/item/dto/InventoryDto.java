package com.ssafy.tingbackend.item.dto;

import com.ssafy.tingbackend.entity.item.Inventory;
import com.ssafy.tingbackend.entity.type.ItemType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryDto {

    private Long inventoryId;

    private Long userId;

    private ItemType itemType;

    private int quantity;

    private String name;
    private String description;

    public static InventoryDto of(Inventory inventory) {
        return InventoryDto.builder()
                .inventoryId(inventory.getId())
                .userId(inventory.getUser().getId())
                .itemType(inventory.getItemType())
                .quantity(inventory.getQuantity())
                .name(inventory.getItemType().getName())
                .description(inventory.getItemType().getDescription())
                .build();
    }
}
