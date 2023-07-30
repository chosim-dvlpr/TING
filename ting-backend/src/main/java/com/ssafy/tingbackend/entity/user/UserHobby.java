package com.ssafy.tingbackend.entity.user;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@ToString(of = {"additionalInfo"})
public class UserHobby {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hobby_code")
    private AdditionalInfo additionalInfo;

    // 내용? enum?
    public UserHobby(User user, AdditionalInfo additionalInfo) {
        this.user = user;
        this.additionalInfo = additionalInfo;
    }
}
