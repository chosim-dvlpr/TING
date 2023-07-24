package com.ssafy.tingbackend.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
public class EmailController {

    @Autowired
    private JavaMailSender javaMailSender;

    @PostMapping("/send")
    public ResponseEntity<Object> send() {
        String key = createKey();
        // 이메일 발신될 데이터 적재
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo("haha990691@gmail.com"); // 수신자 바꾸기
        simpleMailMessage.setSubject("이메일 인증 코드입니다.");
        simpleMailMessage.setText("아래의 인증 코드를 입력해주세요. \n" +
                key + " \n");

        // 이메일 발신
        javaMailSender.send(simpleMailMessage);

        // 결과 반환
        return ResponseEntity.ok(true);
    }

    public static String createKey() {
        StringBuffer key = new StringBuffer();
        Random rnd = new Random();

        for (int i = 0; i < 8; i++) { // 인증코드 8자리
            int index = rnd.nextInt(3); // 0~2 까지 랜덤

            switch (index) {
                case 0:
                    key.append((char) ((int) (rnd.nextInt(26)) + 97));
                    //  a~z  (ex. 1+97=98 => (char)98 = 'b')
                    break;
                case 1:
                    key.append((char) ((int) (rnd.nextInt(26)) + 65));
                    //  A~Z
                    break;
                case 2:
                    key.append((rnd.nextInt(10)));
                    // 0~9
                    break;
            }
        }
        return key.toString();
    }
}