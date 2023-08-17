# 3-2. MySQL Container Setting

### MySQL 이미지 다운로드

```yaml
$ docker pull mysql:latest
```

### MySQL 컨테이너 생성 & Volume 연결

```yaml
$ docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=<password> -v mysql-volume:/var/lib/mysql -d -p 3306:3306 mysql:latest
```

- —name : 컨테이너 이름 설정
- -e : 환경변수 설정 (여기서는 root 비밀번호 설정)
- -v : 볼륨 마운트 (호스트환경의 mysql-volume 과 컨테이너 내부의 /var/lib/mysql 폴더를 연결
- -d : 백그라운드로 실행
- -p : 포트 연결 (호스트 환경의 3306과 컨테이너 내부의 3306 포트를 연결)

### 컨테이너 내부로 들어가기

```yaml
$ docker exec -it mysql-container /bin/bash
```

### MySQL DB를 관리자 권한으로 접속

```yaml
$ mysql -u root -p

// MYSQL_ROOT_PASSWORD 환경변수로 설정한 root 비밀번호 입력
```

### ting 데이터베이스와 계정 생성

```bash
# create database ting;

# create user '계정아이디'@'%' identified by '비밀번호';
```

### ting db 와 생성한 계정 연결

```bash
# grant all privileges on ting.* to '계정아이디'@'%' identified by '계정비밀번호'
```

### 외부에서 접속

- host : 서버의 ip or 도메인 주소
- port : 컨테이너 생성시 입력한 호스트환경의 port 번호 (3306)
- id : 생성한 계정아이디
- password : 생성한 계정비밀번호
- db : 생성한 데이터베이스 이름 (ting)