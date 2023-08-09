package com.ssafy.tingbackend.entity.common;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Getter
@Setter
@DynamicInsert
public class BaseUnmodifidableTimeEntity {
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdTime;

    private LocalDateTime removedTime;
    @ColumnDefault("false")
    private boolean isRemoved;

    // 논쟁, 친구목록
}
