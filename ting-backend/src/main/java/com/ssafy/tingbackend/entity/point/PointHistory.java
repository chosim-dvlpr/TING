package com.ssafy.tingbackend.entity.point;

import com.ssafy.tingbackend.entity.common.BaseCreatedTimeEntity;
import com.ssafy.tingbackend.entity.user.User;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user", "code", "changeCost", "resultPoint"})
public class PointHistory extends BaseCreatedTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "point_code")
    private PointCategory pointCategory;

    private Long changeCost;
    private Long resultPoint;
}
