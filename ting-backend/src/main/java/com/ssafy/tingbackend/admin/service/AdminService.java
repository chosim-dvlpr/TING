package com.ssafy.tingbackend.admin.service;

import com.ssafy.tingbackend.admin.dto.AdminLoginLogDto;
import com.ssafy.tingbackend.admin.dto.AdminQnaDto;
import com.ssafy.tingbackend.admin.dto.AdminReportDto;
import com.ssafy.tingbackend.admin.repository.*;
import com.ssafy.tingbackend.board.repository.AdviceBoardRepository;
import com.ssafy.tingbackend.board.repository.CommentRepository;
import com.ssafy.tingbackend.board.repository.IssueBoardRepository;
import com.ssafy.tingbackend.common.dto.PageResult;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.QnA;
import com.ssafy.tingbackend.entity.Report;
import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.board.Comment;
import com.ssafy.tingbackend.entity.board.IssueBoard;
import com.ssafy.tingbackend.entity.matching.Matching;
import com.ssafy.tingbackend.entity.matching.MatchingUser;
import com.ssafy.tingbackend.entity.payment.PointPayment;
import com.ssafy.tingbackend.entity.type.ReportStateType;
import com.ssafy.tingbackend.entity.type.ReportType;
import com.ssafy.tingbackend.entity.user.LoginLog;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.repository.UserRepository;
import com.ssafy.tingbackend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final AdminReportRepository reportRepository;
    private final UserRepository userRepository;
    private final AdminLoginLogRepository loginLogRepository;
    private final AdminQnaRepository qnaRepository;
    private final AdminPointPaymentRepository pointPaymentRepository;
    private final AdminMatchingRepository matchingRepository;
    private final AdminMatchingUserRepository matchingUserRepository;
    private final AdviceBoardRepository adviceBoardRepository;
    private final IssueBoardRepository issueBoardRepository;
    private final CommentRepository commentRepository;
    private final UserService userService;

    @Transactional
    public Map<String, Object> getReportList(PageRequest pageRequest) {
        Page<Report> reportList = reportRepository.findAll(pageRequest);

        PageResult pageResult = new PageResult(
                reportList.getNumber(),
                reportList.getSize(),
                (int) reportList.getTotalElements(),
                reportList.getTotalPages(),
                reportList.isFirst(),
                reportList.isLast()
        );

        List<AdminReportDto> adminReportDtoList = new ArrayList<>();
        reportList.map(report -> {
            AdminReportDto saveDto = AdminReportDto.of(report);

            if (report.getType() == ReportType.MATCHING) {
                MatchingUser matchingUser = matchingUserRepository.findByMatchingAndNotUser(report.getTypeId(), report.getUser().getId())
                        .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));
                saveDto.setReportedUserId(matchingUser.getUser().getId());
                saveDto.setReportedUserNickname(matchingUser.getUser().getNickname());
            } else if (report.getType() == ReportType.ADVICE_BOARD) {
                AdviceBoard adviceBoard = adviceBoardRepository.findById(report.getTypeId())
                        .orElseThrow(() -> new CommonException(ExceptionType.ADVICE_BOARD_NOT_FOUND));
                saveDto.setReportedUserId(adviceBoard.getUser().getId());
                saveDto.setReportedUserNickname(adviceBoard.getUser().getNickname());
            } else if (report.getType() == ReportType.ISSUE_BOARD) {
                IssueBoard issueBoard = issueBoardRepository.findById(report.getTypeId())
                        .orElseThrow(() -> new CommonException(ExceptionType.ISSUE_BOARD_NOT_FOUND));
                saveDto.setReportedUserId(issueBoard.getUser().getId());
                saveDto.setReportedUserNickname(issueBoard.getUser().getNickname());
            } else if (report.getType() == ReportType.COMMENT) {
                Comment comment = commentRepository.findById(report.getTypeId())
                        .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));
                saveDto.setReportedUserId(comment.getUser().getId());
                saveDto.setReportedUserNickname(comment.getUser().getNickname());
            }

            return adminReportDtoList.add(saveDto);
        });

        return Map.of(
                "reportList", adminReportDtoList,
                "pageResult", pageResult
        );
    }

    @Transactional
    public AdminReportDto getReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new CommonException(ExceptionType.REPORT_NOT_FOUND));

        AdminReportDto saveDto = AdminReportDto.of(report);

        if (report.getType() == ReportType.MATCHING) {
            MatchingUser matchingUser = matchingUserRepository.findByMatchingAndNotUser(report.getTypeId(), report.getUser().getId())
                    .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));
            saveDto.setReportedUserId(matchingUser.getUser().getId());
            saveDto.setReportedUserNickname(matchingUser.getUser().getNickname());
        } else if (report.getType() == ReportType.ADVICE_BOARD) {
            AdviceBoard adviceBoard = adviceBoardRepository.findById(report.getTypeId())
                    .orElseThrow(() -> new CommonException(ExceptionType.ADVICE_BOARD_NOT_FOUND));
            saveDto.setReportedUserId(adviceBoard.getUser().getId());
            saveDto.setReportedUserNickname(adviceBoard.getUser().getNickname());
        } else if (report.getType() == ReportType.ISSUE_BOARD) {
            IssueBoard issueBoard = issueBoardRepository.findById(report.getTypeId())
                    .orElseThrow(() -> new CommonException(ExceptionType.ISSUE_BOARD_NOT_FOUND));
            saveDto.setReportedUserId(issueBoard.getUser().getId());
            saveDto.setReportedUserNickname(issueBoard.getUser().getNickname());
        } else if (report.getType() == ReportType.COMMENT) {
            Comment comment = commentRepository.findById(report.getTypeId())
                    .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));
            saveDto.setReportedUserId(comment.getUser().getId());
            saveDto.setReportedUserNickname(comment.getUser().getNickname());
        }

        return saveDto;
    }

    @Transactional
    public void registerComment(Long reportId, String comment) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new CommonException(ExceptionType.REPORT_NOT_FOUND));
        report.setComment(comment);
        report.setState(ReportStateType.PROCESSED);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        // soft 삭제
        userRepository.softDeleteUser(user.getId(), LocalDateTime.now());
    }

    public Map<String, Object> getLoginLogList(PageRequest pageRequest) {
        Page<LoginLog> loginLogList = loginLogRepository.findAll(pageRequest);

        PageResult pageResult = new PageResult(
                loginLogList.getNumber(),
                loginLogList.getSize(),
                (int) loginLogList.getTotalElements(),
                loginLogList.getTotalPages(),
                loginLogList.isFirst(),
                loginLogList.isLast()
        );

        List<AdminLoginLogDto> loginLogDtoList = new ArrayList<>();
        loginLogList.map(loginLog -> loginLogDtoList.add(AdminLoginLogDto.of(loginLog)));

        return Map.of(
                "loginLogList", loginLogDtoList,
                "pageResult", pageResult
        );
    }

    @Transactional
    public Map<String, Object> getQnaList(PageRequest pageRequest) {
        Page<QnA> qnaList = qnaRepository.findAll(pageRequest);

        PageResult pageResult = new PageResult(
                qnaList.getNumber(),
                qnaList.getSize(),
                (int) qnaList.getTotalElements(),
                qnaList.getTotalPages(),
                qnaList.isFirst(),
                qnaList.isLast()
        );

        List<AdminQnaDto> adminQnaDtoList = new ArrayList<>();
        qnaList.map(qna -> adminQnaDtoList.add(AdminQnaDto.of(qna)));

        return Map.of(
                "qnaList", adminQnaDtoList,
                "pageResult", pageResult
        );
    }

    public AdminQnaDto getQna(Long qnaId) {
        QnA qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new CommonException(ExceptionType.QNA_NOT_FOUND));

        return AdminQnaDto.of(qna);
    }

    @Transactional
    public void answerQna(Long qnaId, String answer) {
        QnA qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new CommonException(ExceptionType.QNA_NOT_FOUND));

        qna.setAnswer(answer);
        qna.setCompletedTime(LocalDateTime.now());
        qna.setCompleted(true);
    }

    @Transactional
    public Map<String, Object> pointPaymentHistoryFor20Day() {
        LocalDateTime dateTime = LocalDateTime.now().minusDays(20);
        List<PointPayment> pointPaymentList = pointPaymentRepository.findPaymentHistory(dateTime);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");


        // 일별 포인트 내역 합계 리스트
        // label, count
        Map<String, Integer> pointPaymentMap = new HashMap<>();
        pointPaymentList.forEach(p -> {
            log.info("time {}", p.getCreatedTime());
            String date = p.getCreatedTime().format(formatter);
            log.info("date {}", date);
            pointPaymentMap.put(date, pointPaymentMap.getOrDefault(date, 0) + p.getPointCode().getTotalAmount());
        });

        LocalDate endDate = LocalDate.now();  // 오늘 날짜
        LocalDate startDate = endDate.minusDays(20);  // 오늘 날짜로부터 20일 전의 날짜

        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            currentDate = currentDate.plusDays(1);  // 다음 날짜로 이동
            String date = currentDate.format(formatter);
            if (!pointPaymentMap.containsKey(date)) {
                pointPaymentMap.put(date, 0);
            }
        }

        List<String> labelList = pointPaymentMap.keySet().stream().sorted().collect(Collectors.toList());
        List<Integer> countList = labelList.stream().map(pointPaymentMap::get).collect(Collectors.toList());

        return Map.of(
                "labelList", labelList,
                "countList", countList
        );
    }

    @Transactional
    public Map<String, Object> matchingHistoryFor20Day() {
        LocalDateTime dateTime = LocalDateTime.now().minusDays(20);
        List<Matching> matchingHistoryList = matchingRepository.findMatchingHistory(dateTime);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");

        // 일별 포인트 내역 합계 리스트
        // label, count
        Map<String, Integer> MatchingMap = new HashMap<>();
        matchingHistoryList.forEach(m -> {
            String date = m.getCreatedTime().format(formatter);
            MatchingMap.put(date, MatchingMap.getOrDefault(date, 0) + 1);
        });

        LocalDate endDate = LocalDate.now();  // 오늘 날짜
        LocalDate startDate = endDate.minusDays(20);  // 오늘 날짜로부터 20일 전의 날짜

        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            currentDate = currentDate.plusDays(1);  // 다음 날짜로 이동
            String date = currentDate.format(formatter);
            if (!MatchingMap.containsKey(date)) {
                MatchingMap.put(date, 0);
            }
        }

        List<String> labelList = MatchingMap.keySet().stream().sorted().collect(Collectors.toList());
        List<Integer> countList = labelList.stream().map(MatchingMap::get).collect(Collectors.toList());

        return Map.of(
                "labelList", labelList,
                "countList", countList
        );
    }

    public Integer matchingCount() {
        return matchingRepository.findMatchingCount();
    }

    public Integer userCount() {
        return userRepository.findUserCount();
    }

    public Integer reportCount() {
        return reportRepository.findReportCount();
    }

    public Long totalProfit() {
        return pointPaymentRepository.findTotalProfit();
    }

    public UserDto.Detail getUser(Long userId) {
        return userService.userDetail(userId);
    }
}
