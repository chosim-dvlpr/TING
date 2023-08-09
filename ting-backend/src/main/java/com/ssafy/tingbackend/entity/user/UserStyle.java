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
public class UserStyle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "style_code")
    private AdditionalInfo additionalInfo;

    public UserStyle(User user, AdditionalInfo additionalInfo) {
        this.user = user;
        this.additionalInfo = additionalInfo;
    }
}
