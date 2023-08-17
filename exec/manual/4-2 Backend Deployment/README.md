# 4-2. Backend Deployment

### SpringBoot Dockerfile

```
FROM openjdk:11-jre

ENV TZ=Asia/Seoul

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY build/libs/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
```

### EC2 서버에서 백엔드 프로젝트 수동 배포  (Jenkins 사용 x)

### 1. git 을 통해 소스코드를 clone

```
# git clone {GIT_HTTPS_URL}
```

- 원하는 폴더경로로 이동하여 진행

### 2. backend 프로젝트의 Dockerfile이 위치한 최상위 폴더로 이동

### 3. Dockerfile 빌드

```
# docker build -t ${IMAGE_NAME} . 
```

### 4. Docker 컨테이너 실행

```
# docker run --name ${CONTAINER_NAME} -v ${VOLUME_NAME}:/app/profile -d -p 8080:8080 ${IMAGE_NAME}
```

- 호스트환경의 8080 포트와 컨테이너 내부의 8080 포트를 연결.
- 서버 도메인의 8080 포트로 접속하면 백엔드 컨테이너에 요청을 보낼 수 있다.