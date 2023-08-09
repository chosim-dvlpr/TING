package com.ssafy.tingbackend.entity.payment;

import com.ssafy.tingbackend.entity.type.PaymentMethodType;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"user", "pointCode"})
public class PointPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "point_code")
    private PointCode pointCode;

    private int quantity;
    private String cid;
    private String aid;
    private String tid;
    private String pgToken;

    @Enumerated(EnumType.STRING)
    private PaymentMethodType paymentMethodType;

    private LocalDateTime createdTime;

}
