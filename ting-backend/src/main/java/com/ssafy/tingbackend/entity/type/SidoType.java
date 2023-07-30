package com.ssafy.tingbackend.entity.type;

public enum SidoType {
    SEOUL("서울특별시"),
    BUSAN("부산광역시"),
    DAEGU("대구광역시"),
    INCHEON("인천광역시"),
    GUANGJU("광주광역시"),
    DAEJEON("대전광역시"),
    ULSAN("울산광역시"),
    SEJONG("세종특별자치시"),
    GYEONGGIDO("경기도"),
    GANGWONDO("강원도"),
    CHUNGCHEONG_BUKDO("충청북도"),
    CHUNGCHEONG_NAMDO("충청남도"),
    JEONRA_BUKDO("전라북도"),
    JEONRA_NAMDO("전라남도"),
    KYEONGSANG_BUKDO("경상북도"),
    KYEONGSANG_NAMDO("경상남도"),
    JEJUDO("제주특별자치도");

    private final String name;

    SidoType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    // name에 해당하는 Enum 객체 반환
    public static SidoType getEnumType(String name) {
        SidoType sidoType = null;
        for (SidoType sido : SidoType.values()) {
            if(sido.getName().equals(name)) sidoType = sido;
        }

        return sidoType;
    }
}
