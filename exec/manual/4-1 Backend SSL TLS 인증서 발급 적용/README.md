# 4-1. Backend SSL/TLS 인증서 발급/적용

Apache나 Nginx 없이 Spring boot 자체 설정으로 SSL 인증서를 발급받아 적용하는 방법을 적용했다.

EC2 서버에 접속해 리눅스 환경에서 Let’s Encrypt SSL 인증서를 standalone 방식으로 발급받는다.

### 1. certbot 설치

```
$ sudo apt-get install certbot
```

### 2. 기존에 80 port를 사용 중인 프로세스를 제거한다.

```
// 현재 사용중인 포트와 해당 포트를 사용하는 프로세스 정보가 출력된다.
$ netstat -ntlp
```

### 3. certbot 을 standalone 방식으로 구동

```
$ sudo certbot certainly --standalone
```

- 이메일, 도메인 주소를 입력
- 발급에 성공하면 /etc/letsencrypt/live/도메인/ 경로에 fullchain.pem 키와 privkey.pem 이 생성된다

### 4. pem 을 SpringBoot에서 인식할 수 있는 PKCS12 형식으로 변경

```
// fullchain.pem 과 privkey.pem 이 발급받아진 경로로 이동
$ cd /etc/letsencrypt/live/도메인/

// keystore.p12 생성
$ sudo openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out keystore.p12 -name ttp -CAfile chain.pem -caname root
```

- 위 명령어를 입력하면 비밀번호를 입력하는 안내가 나오는데 이는 SpringBoot 설정에 필요하므로 잘 적어둬야 한다.
- 비밀번호를 입력하면 해당 경로에 keystore.p12 파일이 생성된다.

### 5. linux 에 있는 파일 keystore.p12 파일을 window 환경으로 옮기기

- Termius ssh 접속 툴의 sftp 기능을 이용하여 옮기자

### 6. Springboot 의 resources 폴더 하위에 keystore.p12 파일을 옮기고, ssl 설정

```
# application.yml

server:
  port: {서버 포트번호}
  ssl:
    key-store: classpath:keystore.p12  # 인증서 파일 경로
    key-store-type: PKCS12
    key-store-password: {설정한 비밀번호}
```

### 추가 : 인증서 자동갱신

lets encrypt 를 통해 발급받은 ssl 인증서는 유효기간이 90일 이므로 기간이 지나면 새로 발급받아야 한다.

매번 인증서를 발급받는 것은 힘들 수 있으니 cron 표현식을 이용해 인증서를 자동갱신하는 설정을 하도록 했다.

```
// cronttab 편집
$ crontab -e

// 결과
root@ip-172-26-6-193:/home/ubuntu# crontab -e
```

```
// 위 결과에 매달 1일 자동갱신을 해주는 명령어를 입력하고 저장 후 나오자.
$ 0 2 1 * * /usr/bin/certbot renew
```