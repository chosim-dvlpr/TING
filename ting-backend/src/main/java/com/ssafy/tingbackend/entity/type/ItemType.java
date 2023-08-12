package com.ssafy.tingbackend.entity.type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
@Getter
public enum ItemType {
    MATCHING_TICKET("구매한 티켓"),
    REVIVE_TICKET("물고기 부활 티켓"),
    CHANGE_NICKNAME("닉네임 변경권"),
    RANDOM_SKIN_BOX("물고기 스킨 랜덤박스"),
    FREE_MATCHING_TICKET("무료 티켓"),
    SKIN_2("유리병"),
    SKIN_3("작은 어항"),
    SKIN_5("수조"),
    SKIN_10("아쿠아리움");

    private String name;
}
