package com.ssafy.tingbackend.entity.user;

import com.ssafy.tingbackend.entity.common.BaseTimeEntity;
import com.ssafy.tingbackend.entity.item.FishSkin;
import com.ssafy.tingbackend.entity.type.SidoType;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
@ToString(of = {"id", "email", "nickname", "gender", "region", "jobCode", "drinkingCode", "smokingCode", "religionCode", "mbtiCode", "userHobbys", "userPersonalities", "userStyles"})
//@ToString(of = {"id", "nickname", "gender"})
@DynamicInsert
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private String phoneNumber;

    @Column(length = 1)
    private String gender;

    @Enumerated(EnumType.STRING)
    private SidoType region;
    private LocalDate birth;
    private String profileImage;

    @ColumnDefault("0")
    private Long point;
    private Integer height;
    private String introduce;

    @JoinColumn(name = "fish_skin_code")
    @OneToOne(fetch = FetchType.EAGER)
    private FishSkin fishSkin;

    // 직업, 음주, 흡연, 종교, MBTI, 성격, 취미, 스타일
    @OneToOne
    private AdditionalInfo jobCode;

    @OneToOne
    private AdditionalInfo drinkingCode;

    @OneToOne
    private AdditionalInfo religionCode;

    @OneToOne
    private AdditionalInfo mbtiCode;

    @OneToOne
    private AdditionalInfo smokingCode;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private List<UserHobby> userHobbys = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private List<UserStyle> userStyles = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private List<UserPersonality> userPersonalities = new ArrayList<>();

}
