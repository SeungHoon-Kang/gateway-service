# Event Reward Gateway Service

이 프로젝트는 이벤트 리워드 시스템의 게이트웨이 서비스입니다. NestJS를 기반으로 구축되었으며, 인증 서비스와 이벤트 서비스 간의 프록시 역할을 수행합니다.

MSA 환경을 시연하기 위해서 gateway-service, auth-service, event-service 총 3개의 레포로 분리하였습니다.


## 주요 기능

- JWT 기반 인증
- 역할 기반 접근 제어 (RBAC)
- API 요청 프록시
- 통합 응답 포맷팅

## 기술 스택

- NestJS
- TypeScript
- Passport.js
- JWT
- Axios

## API 엔드포인트

### 인증 관련
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/register` - 회원가입
- `GET /api/v1/auth/users` - 사용자 정보 조회

### 이벤트 관련
- `POST /api/v1/event/register` - 이벤트 등록 (ADMIN, OPERATOR)
- `GET /api/v1/event/list` - 이벤트 목록 조회 (USER, OPERATOR, ADMIN, AUDITOR)

### 리워드 관련
- `POST /api/v1/reward/create` - 리워드 생성 (ADMIN, OPERATOR)
- `GET /api/v1/reward/list` - 리워드 목록 조회 (ADMIN, OPERATOR)
- `POST /api/v1/reward/request` - 리워드 요청 (USER, ADMIN, OPERATOR, AUDITOR)
- `GET /api/v1/reward/hist` - 리워드 히스토리 조회 (USER, ADMIN, OPERATOR, AUDITOR)

## 역할 기반 접근 제어

- ADMIN: 모든 권한
- OPERATOR: 이벤트 및 리워드 관리 권한
- AUDITOR: 조회 권한
- USER: 기본 사용자 권한

```
src/
├── auth/                 # 인증 관련 모듈
│   ├── jwt-auth.guard.ts
│   ├── jwt.strategy.ts
│   ├── roles.decorator.ts
│   └── roles.guard.ts
├── common/              # 공통 모듈
│   └── interceptors/
│       └── response.interceptor.ts
├── proxy/              # 프록시 관련 모듈
│   ├── proxy.auth.ts
│   ├── proxy.controller.ts
│   └── proxy.event.ts
├── types/              # 타입 정의
│   └── jwt-user.ts
├── app.module.ts
└── main.ts
```

## 설치 및 실행

1. 의존성 설치
```bash
yarn
```

2. 서버 실행
```bash
yarn start:dev

## 에러 처리

- 401: 인증 실패
- 403: 권한 없음
- 500: 서버 내부 오류

## 보안

- JWT 토큰 기반 인증
- 역할 기반 접근 제어
- CORS 설정
- 요청 검증 (ValidationPipe)

