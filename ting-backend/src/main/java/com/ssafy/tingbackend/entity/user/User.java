package com.ssafy.tingbackend.entity.user;

import com.ssafy.tingbackend.entity.common.BaseTimeEntity;
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
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@ToString(of = {"id", "email", "nickname", "gender"})
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
    @Column(columnDefinition = "char(1)")
    private Character gender;
    @Enumerated(EnumType.STRING)
    private SidoType region;
    private LocalDate birth;
    private String profileImage;
    @ColumnDefault("0")
    private Long point;
    private Integer height;
    private String introduce;

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

    @OneToMany(mappedBy = "user")
    List<UserHobby> userHobbys = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    List<UserStyle> userStyles = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    List<UserPersonality> userPersonalities = new ArrayList<>();

    //not null
    // email password name nickname phone gender region birth point created isremoved
//    @Column(nullable = false)
}
