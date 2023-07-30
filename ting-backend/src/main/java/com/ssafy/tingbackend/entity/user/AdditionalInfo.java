package com.ssafy.tingbackend.entity.user;

import com.ssafy.tingbackend.entity.type.AdditionalType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.Hibernate;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"category", "name"})
public class AdditionalInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long code;
    // 직업, 음주, 흡연, 종교, MBTI, 성격, 취미, 스타일
    @Enumerated(EnumType.STRING)
    private AdditionalType category;
    private String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;

        AdditionalInfo additionalInfo = (AdditionalInfo) o;
        return code != null && Objects.equals(code, additionalInfo.getCode());
    }
}
