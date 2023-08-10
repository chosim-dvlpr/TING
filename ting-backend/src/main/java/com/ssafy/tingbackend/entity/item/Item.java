package com.ssafy.tingbackend.entity.item;

import com.ssafy.tingbackend.entity.type.ItemType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"code", "name", "price"})
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long code;

    private String name;
    private Long price;
    private String description;

    @Enumerated(EnumType.STRING)
    private ItemType category;
}
