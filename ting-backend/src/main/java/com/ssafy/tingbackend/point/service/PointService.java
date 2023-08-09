package com.ssafy.tingbackend.point.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.payment.PointCode;
import com.ssafy.tingbackend.entity.point.PointCategory;
import com.ssafy.tingbackend.entity.point.PointHistory;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.point.dto.PointCodeDto;
import com.ssafy.tingbackend.point.dto.PointHistoryDto;
import com.ssafy.tingbackend.point.repository.PointCategoryRepository;
import com.ssafy.tingbackend.point.repository.PointCodeRepository;
import com.ssafy.tingbackend.point.repository.PointHistoryRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PointService {
    private final UserRepository userRepository;
    private final PointHistoryRepository pointHistoryRepository;
    private final PointCategoryRepository pointCategoryRepository;
    private final PointCodeRepository pointCodeRepository;

    public Long getPoint(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        return user.getPoint();
    }

    @Transactional
    public void chargePoint(Long userId, Long chargeCost) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        user.setPoint(user.getPoint() + chargeCost);

//        포인트 충전 카테고리
        PointCategory pointCategory = pointCategoryRepository.findById(1L)
                .orElseThrow(() -> new CommonException(ExceptionType.POINT_CATEGORY_NOT_FOUND));

        PointHistory pointHistory = new PointHistory();
        pointHistory.setUser(user);
        pointHistory.setPointCategory(pointCategory);
        pointHistory.setChangeCost(chargeCost);
        pointHistory.setResultPoint(user.getPoint());
        pointHistory.setCreatedTime(LocalDateTime.now());

        pointHistoryRepository.save(pointHistory);
    }

    @Transactional
    public Map<String, Object> getPointHistory(Long userId, int pageNo) {
        userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        Map<String, Object> result = new HashMap<>();

        PageRequest pageRequest = PageRequest.of(pageNo-1, 5, Sort.by(Sort.Direction.DESC,
                "createdTime"));
        Page<PointHistory> page = pointHistoryRepository.findByUser(pageRequest, userId);
        List<PointHistory> pointHistoryList = page.getContent();

        List<PointHistoryDto> pointHistoryDtoList = new ArrayList<>();
        for(PointHistory pointHistory: pointHistoryList) {
            pointHistoryDtoList.add(PointHistoryDto.of(pointHistory));
        }

        result.put("pointList", pointHistoryDtoList);
        result.put("totalPages", page.getTotalPages());
        result.put("totalElements", page.getTotalElements());
        return result;
    }

    public List<PointCodeDto> getPointChargeList() {
        List<PointCode> pointCodeList = pointCodeRepository.findAll();

        List<PointCodeDto> result = new ArrayList<>();
        pointCodeList.forEach((pointCode) -> result.add(PointCodeDto.of(pointCode)));

        return result;
    }
}
