package com.ssafy.tingbackend.matching.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenViduService {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * session 생성 후 session id 를 반환한다.
     * @return The Session ID
     */
    public Session initializeSession() throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.createSession();

        log.info("session id: {}", session.getSessionId());
        return session;
    }

    /**
     * sessionId에 접속할 수 있는 토큰을 반환한다.
     * @param sessionId The Session in which to create the Connection
     * @return The Token associated to the Connection
     */
    public String createConnection(String sessionId) {
        Session session = openvidu.getActiveSession(sessionId);
        Connection connection = null;
        try {
            connection = session.createConnection();
        } catch (Exception e) {
            e.printStackTrace();
            throw new CommonException(ExceptionType.OPENVIDU_ERROR);
        }

        log.info("token: {}", connection.getToken());
        return connection.getToken();
    }

}
