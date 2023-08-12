package com.ssafy.tingbackend.entity.payment;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointCode {

    @Id
    private Long code;

    private String itemName;
    private int totalAmount;
    private int taxFreeAmount;

}
