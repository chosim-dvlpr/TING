# 3-1. Install Docker & Docker Compose

### Docker & Docker Compose 버전

- docker : Docker version 24.0.5, build ced0996
- docker-compose : docker-compose version 1.25.0, build unknown

### Ubuntu 20.04 LTS 버전

### 1. 우분투 시스템 패키지 업데이트

```
sudo apt-get update
```

### 2. 필요한 패키지 설치

```
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

### 3. Docker의 공식 GPG키를 추가

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

### 4. Docker의 공식 apt 저장소를 추가

```
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

### 5. 시스템 패키지 업데이트

```
sudo apt-get update
```

### 6. Docker 설치

```
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### 7. Docker가 설치 확인

7-1 도커 실행상태 확인

```ebnf
sudo systemctl status docker

sudo docker --version
```

### 8. Docker Compose 설치

```
sudo curl -L https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
```

### 9. Docker Compose 권한 설정

```
sudo chmod +x /usr/local/bin/docker-compose
```

### 10. Docker Compose 설치 확인

```
docker-compose --version

Docker Compose version v2.5.0
```