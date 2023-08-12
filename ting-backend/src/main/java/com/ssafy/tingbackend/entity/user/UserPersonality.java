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
public class UserPersonality {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personality_code")
    private AdditionalInfo additionalInfo;

    public UserPersonality(User user, AdditionalInfo additionalInfo) {
        this.user = user;
        this.additionalInfo = additionalInfo;
    }
}
