package com.ssafy.tingbackend.entity.chatting;

import com.ssafy.tingbackend.entity.common.BaseUnmodifidableTimeEntity;
import com.ssafy.tingbackend.entity.type.BoardType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"chattingUsers", "lastChattingTime", "lastChattingContent", "state", "temperature"})
@DynamicInsert
public class Chatting extends BaseUnmodifidableTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime lastChattingTime;
    private String lastChattingContent;
    @Enumerated(EnumType.STRING)
    private BoardType state;
    @ColumnDefault("36.5")
    private BigDecimal temperature;

    @OneToMany(mappedBy = "chatting")
    private List<ChattingUser> chattingUsers = new ArrayList<>();
}
