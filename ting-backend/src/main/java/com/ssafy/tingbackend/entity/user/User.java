package com.ssafy.tingbackend.entity.user;

import com.ssafy.tingbackend.entity.common.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"id", "email", "nickname", "gender"})
@DynamicInsert
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String name;
    private String nickname;
    private String phoneNumber;
    @Column(columnDefinition = "char(1)")
    private Character gender;
    private String region;
    private LocalDate birth;
    private String profileImage;
    @ColumnDefault("0")
    private Long point;
    private Integer height;
    private String introduce;

    // 직업, 음주, 흡연, 종교, MBTI, 성격, 취미, 스타일
    @OneToOne(fetch = FetchType.LAZY)
    AdditionalInfo additionalInfo;


    //not null
    // email password name nickname phone gender region birth point created isremoved
//    @Column(nullable = false)
}
