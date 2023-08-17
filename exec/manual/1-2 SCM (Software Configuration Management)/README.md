# 1-2. SCM (Software Configuration Management)

### 형상관리 소프트웨어

- Git : git version 2.41.0.windows.1
- Gitlab

### commit 메세지 컨벤션

- `{type}: {설명}`
    - ex) feat: rest api 구현
- type 과 콜론(:) 은 띄어쓰지 않음
- 콜론(:)과 설명 사이에 한 칸 띄어쓰기
- Commit type → **소문자로**

| feat | 새로운 기능 추가 |
| --- | --- |
| fix | 기능적 버그 수정 또는 typo (오타) |
| refactor | 리팩토링 |
| design | CSS 등  사용자 UI 디자인 변경 |
| chore | 라이브러리 추가, npm 추가 사항 있을 때 |
| test | 테스트 코드 작성시 |
| comment | 필요한 주석 추가 및 변경 |
| rename | 파일 혹은 폴더명 수정, 디렉토리 변경 |

### Branch 전략

master branch

- 최종 배포 단계의 브랜치

develop branch

- frontend 코드와 backend 코드가 합쳐지는 브랜치

develop-front branch

- frontend 작업의 결과물이 합쳐지는 브랜치

develop-back branch

- backend 작업의 결과물이 합쳐지는 브랜치

feature/{기능} branch

- ex) `feature/webrtc`
- 기능 구현시 브랜치 생성 후 작업

fix/{기능} branch

- ex) `fix/webrtc`
- 수정사항 발생시 사용하는 브랜치