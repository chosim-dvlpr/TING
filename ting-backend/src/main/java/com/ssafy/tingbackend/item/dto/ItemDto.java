package com.ssafy.tingbackend.item.dto;

import com.ssafy.tingbackend.entity.item.Item;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class ItemDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    public static class Basic {
        private Long code;
        private String name;
        private Long price;

        public static Basic of(Item item) {
            return Basic.builder()
                    .code(item.getCode())
                    .name(item.getName())
                    .price(item.getPrice())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    public static class OwnItem {
        private Long code;
        private String name;
        private Long price;
        private int quantity;

        public static OwnItem of(Item item) {
            return OwnItem.builder()
                    .code(item.getCode())
                    .name(item.getName())
                    .price(item.getPrice())
                    .quantity(1)
                    .build();
        }

        public void addQuantity() {
            this.quantity++;
        }
    }

}
