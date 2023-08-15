package com.ssafy.tingbackend.entity.chatting;

import com.ssafy.tingbackend.entity.common.BaseUnmodifidableTimeEntity;
import com.ssafy.tingbackend.entity.type.BoardType;
import com.ssafy.tingbackend.entity.type.ChattingType;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"lastChattingTime", "lastChattingContent", "state", "temperature"})
@DynamicInsert
public class Chatting extends BaseUnmodifidableTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime lastChattingTime;
    private String lastChattingContent;
    @Enumerated(EnumType.STRING)
    private ChattingType state;
    @ColumnDefault("36.5")
    private BigDecimal temperature;

    @OneToMany(mappedBy = "chatting")
    private List<ChattingUser> chattingUsers = new ArrayList<>();

    public void changeTemperature(BigDecimal diff) {
        this.temperature = this.temperature.add(diff);

        // 온도 범위 0.0~100.0
        if (this.temperature.compareTo(BigDecimal.valueOf(100)) > 0) this.temperature = BigDecimal.valueOf(100.0);
        else if (this.temperature.compareTo(BigDecimal.valueOf(0)) < 0) this.temperature = BigDecimal.valueOf(0.0);
    }

    public Chatting(ChattingType state) {
        this.state = state;
        this.temperature = new BigDecimal(36.5);
    }
}
