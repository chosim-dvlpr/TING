package com.ssafy.tingbackend.entity.type;

public enum AdditionalType {
    JOB("직업"),
    DRINKING("음주"),
    SMOKING("흡연"),
    RELIGION("종교"),
    MBTI("MBTI"),
    PERSONALITY("성격"),
    HOBBY("취미"),
    STYLE("스타일");

    private final String name;

    AdditionalType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
