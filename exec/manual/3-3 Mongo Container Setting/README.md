# 3-3. Mongo Container Setting

### Mongo 이미지 다운로드

```bash
$ docker pull mongo
```

### Mongo 컨테이너 실행 & Volume 연결

```bash
$ docker run --name mongo-container -v ~/data:/data/db -d -p 27017:27017 mongo
```

- —name : 컨테이너 이름 설정
- -v : 볼륨 마운트 (호스트환경의 ~/data와 컨테이너 내부의 /data/db 폴더를 연결
- -d : 백그라운드로 실행
- -p : 포트 연결 (호스트 환경의 27017과 컨테이너 내부의 27017포트를 연결)

### Mongo 컨테이너 내부 접속

```bash
$ docker exec -it mongo-container /bin/bash
```

### Root 계정으로 Mongo DB 접속

```bash
# mongosh -u root -p
```

### 계정 및 DB 생성

```bash
# use admin;

# db.createUser(
  {
    user: "book",
    pwd:  "1234",
    roles: [
    	{ "role" : "root", "db" : "admin" },
	]
  }
)
```