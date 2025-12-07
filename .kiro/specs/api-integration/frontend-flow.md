# 프론트엔드 화면 플로우

## 전체 라우팅 구조

```
/ (루트)
├── /                          → LandingPage (랜딩 페이지)
├── /login                     → LoginPage (로그인)
├── /register                  → RegisterPage (회원가입)
├── /workspaces                → WorkspacesPage (워크스페이스 목록)
├── /workspaces/:workspaceId   → WorkspaceDetailPage (워크스페이스 상세 - 함수 목록 포함)
├── /create                    → CreateFunctionPage (함수 생성)
├── /edit/:functionId          → CreateFunctionPage (함수 편집)
├── /functions/:functionId     → FunctionDetailPage (함수 상세)
└── /functions/:functionId/logs → FunctionLogsPage (함수 로그)
```

**참고:** `/gallery` 라우트는 존재하지만 실제로는 워크스페이스 상세 페이지가 함수 갤러리 역할을 합니다.

---

## 주요 화면 플로우

### 1. 인증 플로우 (Authentication Flow)

```
┌─────────────┐
│ LandingPage │ (/)
└──────┬──────┘
       │
       ├─→ "Get Started" 클릭
       │   ┌──────────────┐
       │   │ RegisterPage │ (/register)
       │   └──────┬───────┘
       │          │
       │          └─→ 회원가입 완료 → LoginPage
       │
       └─→ "Login" 클릭
           ┌───────────┐
           │ LoginPage │ (/login)
           └─────┬─────┘
                 │
                 └─→ 로그인 성공 → WorkspacesPage
```

**주요 기능:**
- 랜딩 페이지: 서비스 소개, 주요 기능 안내
- 회원가입: username, name, password 입력
- 로그인: JWT 토큰 발급 및 저장

---

### 2. 워크스페이스 관리 플로우 (Workspace Management Flow)

```
┌────────────────┐
│ WorkspacesPage │ (/workspaces)
└────────┬───────┘
         │
         ├─→ 워크스페이스 생성
         │   - 이름 입력
         │   - POST /workspaces/
         │
         └─→ 워크스페이스 선택
             ┌──────────────────────┐
             │ WorkspaceDetailPage  │ (/workspaces/:workspaceId)
             └──────────┬───────────┘
                        │
                        ├─→ 워크스페이스 정보 조회
                        │   - GET /workspaces/:workspaceId
                        │
                        ├─→ 소속 함수 목록 조회 (함수 갤러리)
                        │   - GET /workspaces/:workspaceId/functions
                        │   - 카드 형태로 표시
                        │   - 검색 및 필터링
                        │
                        ├─→ 새 함수 생성
                        │   - "Create Function" 버튼
                        │   - → CreateFunctionPage
                        │
                        ├─→ 함수 카드 클릭
                        │   - → FunctionDetailPage
                        │
                        ├─→ 워크스페이스 설정
                        │   - 워크스페이스 수정
                        │   - 워크스페이스 삭제
                        │   - 인증키 발급
                        │
                        └─→ 워크스페이스 메트릭스 조회
                            - GET /workspaces/:workspaceId/metrics
```

**주요 기능:**
- 워크스페이스 목록 조회 (GET /workspaces/)
- 워크스페이스 생성/수정/삭제
- **워크스페이스별 함수 목록 표시 (함수 갤러리 역할)**
- 함수 검색 및 필터링
- 워크스페이스 인증키 발급 (API 호출용)
- 워크스페이스 메트릭스 확인

---

### 3. 함수 생성/편집 플로우 (Function Creation/Edit Flow)

```
┌────────────────────┐
│ CreateFunctionPage │ (/create?workspace_id=xxx)
└─────────┬──────────┘
          │
          ├─→ 함수 정보 입력
          │   - 함수 이름
          │   - 런타임 선택 (Node.js / Python)
          │   - 코드 작성 (Monaco Editor)
          │
          ├─→ 템플릿 선택 (선택사항)
          │   - 미리 정의된 템플릿 사용
          │
          ├─→ 실시간 테스트
          │   - 입력 데이터 작성
          │   - 함수 실행 테스트
          │   - 결과 확인
          │
          ├─→ 자동 저장 (Auto-save)
          │   - 2초마다 자동 저장
          │   - 변경사항 추적
          │
          ├─→ 수동 저장 (Cmd/Ctrl + S)
          │
          └─→ 배포 (Deploy)
              ├─→ Sync 모드 배포
              │   - POST /functions/
              │   - execution_type: "SYNC"
              │
              └─→ Async 모드 배포
                  - POST /functions/
                  - execution_type: "ASYNC"
                  │
                  └─→ 배포 완료 → FunctionDetailPage
```

**주요 기능:**
- 코드 에디터 (Monaco Editor)
  - 문법 하이라이팅
  - 자동 완성
  - 런타임별 기본 코드 제공
- 실시간 테스트 패널
  - JSON 입력
  - 실행 결과 확인
  - 실행 시간 측정
- 자동 저장 기능
- 템플릿 선택
- 풀스크린 모드
- 메트릭스 표시 (실행 시간, CPU, 메모리)

---

### 4. 함수 상세 플로우 (Function Detail Flow)

```
┌──────────────────────┐
│ WorkspaceDetailPage  │ (/workspaces/:workspaceId)
└──────────┬───────────┘
           │
           └─→ 함수 카드 클릭
               ┌──────────────────┐
               │ FunctionDetailPage │ (/functions/:functionId)
               └──────────┬─────────┘
                          │
                          ├─→ 함수 정보 조회
                          │   - GET /functions/:functionId
                          │
                          ├─→ 함수 실행
                          │   - POST /functions/:functionId/invoke
                          │   - 입력 데이터 전송
                          │   - 결과 확인
                          │
                          ├─→ 함수 메트릭스
                          │   - GET /functions/:functionId/metrics
                          │   - 실행 통계 확인
                          │
                          ├─→ 함수 작업 이력
                          │   - GET /functions/:functionId/jobs
                          │
                          ├─→ 함수 로그 보기
                          │   ┌─────────────────┐
                          │   │ FunctionLogsPage │ (/functions/:functionId/logs)
                          │   └─────────────────┘
                          │
                          ├─→ 함수 편집
                          │   - → CreateFunctionPage (edit mode)
                          │
                          └─→ 함수 삭제
                              - DELETE /functions/:functionId
                              - → WorkspaceDetailPage로 돌아감
```

**주요 기능:**
- 함수 상세 정보 조회
- 함수 실행 (Executor)
- 메트릭스 확인
- 작업 이력 조회
- 로그 확인
- 함수 편집/삭제

---

## 화면별 주요 컴포넌트

### LandingPage
- `LandingNavigation`: 네비게이션 바
- `HeroSection`: 히어로 섹션
- `FeaturesSection`: 기능 소개 섹션
- `LandingFooter`: 푸터

### LoginPage / RegisterPage
- 폼 입력 필드
- 인증 처리
- 에러 핸들링

### WorkspacesPage
- 워크스페이스 목록
- 생성 버튼
- 워크스페이스 카드

### WorkspaceDetailPage (함수 갤러리 역할)
- 워크스페이스 정보
- **소속 함수 목록 (카드 그리드)**
- **함수 검색 및 필터링**
- **새 함수 생성 버튼**
- 워크스페이스 메트릭스
- 인증키 관리
- 워크스페이스 설정

### CreateFunctionPage
- `CodeEditor`: 코드 편집기 (Monaco)
- `FunctionTester`: 테스트 패널
- `FunctionMetrics`: 메트릭스 표시
- `TemplateSelector`: 템플릿 선택 모달
- 자동 저장 기능 (`useAutoSave` hook)



### FunctionDetailPage
- `FunctionExecutor`: 함수 실행 패널
- `FunctionMetrics`: 메트릭스 표시
- 함수 정보 표시
- 편집/삭제 버튼

### FunctionLogsPage
- 로그 목록
- 필터링
- 실시간 업데이트

---

## 사용자 여정 (User Journey)

### 신규 사용자
```
1. 랜딩 페이지 방문 (/)
   ↓
2. "Get Started" 클릭 → 회원가입 (/register)
   ↓
3. 로그인 (/login)
   ↓
4. 워크스페이스 생성 (/workspaces)
   ↓
5. 워크스페이스 선택 → 워크스페이스 상세 페이지 (/workspaces/:workspaceId)
   ↓
6. "Create Function" 클릭 → 함수 생성 (/create?workspace_id=xxx)
   ↓
7. 코드 작성 및 테스트
   ↓
8. 배포 (Deploy)
   ↓
9. 워크스페이스 상세 페이지로 돌아가서 함수 목록 확인
   ↓
10. 함수 카드 클릭 → 함수 상세 페이지에서 실행 확인 (/functions/:functionId)
```

### 기존 사용자
```
1. 로그인 (/login)
   ↓
2. 워크스페이스 선택 (/workspaces)
   ↓
3. 워크스페이스 상세 페이지 (/workspaces/:workspaceId)
   - 함수 목록 확인 (함수 갤러리)
   - 함수 검색
   ↓
4. 기존 함수 편집 또는 새 함수 생성
   ↓
5. 함수 실행 및 모니터링
```

---

## 상태 관리

### 인증 상태
- `useAuth` hook 사용
- JWT 토큰 관리
- 로그인/로그아웃 처리

### 워크스페이스 상태
- `useWorkspaces` hook 사용
- 현재 선택된 워크스페이스 관리

### 함수 상태
- `useFunctions` hook 사용
- 함수 목록 관리
- CRUD 작업

### 변경 추적
- `useChangeTracking` hook 사용
- 저장되지 않은 변경사항 추적
- 자동 저장 트리거

---

## API 연동 포인트

### 인증
- `POST /users/register` - 회원가입
- `POST /users/login` - 로그인
- `GET /users/me` - 현재 사용자 정보

### 워크스페이스
- `GET /workspaces/` - 목록 조회
- `POST /workspaces/` - 생성
- `GET /workspaces/:id` - 상세 조회
- `PUT /workspaces/:id` - 수정
- `DELETE /workspaces/:id` - 삭제
- `POST /workspaces/:id/auth-keys` - 인증키 발급
- `GET /workspaces/:id/metrics` - 메트릭스 조회
- `GET /workspaces/:id/functions` - 소속 함수 목록

### 함수
- `GET /functions/` - 목록 조회
- `POST /functions/` - 생성
- `GET /functions/:id` - 상세 조회
- `PUT /functions/:id` - 수정
- `DELETE /functions/:id` - 삭제
- `POST /functions/:id/invoke` - 실행 (사용자 인증)
- `POST /functions/:id/invoke/workspace` - 실행 (워크스페이스 인증)
- `GET /functions/:id/jobs` - 작업 이력
- `GET /functions/:id/metrics` - 메트릭스

### 작업
- `GET /jobs/:id` - 작업 상세 조회

---

## 주요 기능 특징

### 1. 실시간 코드 편집
- Monaco Editor 사용
- 문법 하이라이팅
- 자동 완성
- 런타임별 기본 템플릿

### 2. 자동 저장
- 2초 간격 자동 저장
- 변경사항 추적
- 저장 상태 시각적 피드백

### 3. 실시간 테스트
- 코드 작성 중 즉시 테스트
- 입력/출력 확인
- 실행 시간 측정

### 4. 메트릭스 모니터링
- 실행 시간
- CPU 사용률
- 메모리 사용량
- 성공/실패 횟수

### 5. 템플릿 시스템
- 미리 정의된 함수 템플릿
- 빠른 시작 가능

### 6. 반응형 디자인
- 모바일/태블릿/데스크톱 지원
- 풀스크린 모드
- 분할 패널 (Resizable)

---

## 네비게이션 패턴

### 주요 네비게이션
- 랜딩 페이지 → 로그인/회원가입
- 로그인 → 워크스페이스 목록
- 워크스페이스 목록 → 워크스페이스 상세 (함수 갤러리)
- 워크스페이스 상세 → 함수 생성/상세

### 뒤로 가기 패턴
- 함수 생성 페이지 → 워크스페이스 상세 (함수 갤러리)
- 함수 상세 페이지 → 워크스페이스 상세 (함수 갤러리)
- 함수 로그 페이지 → 함수 상세
- 워크스페이스 상세 → 워크스페이스 목록

### 빠른 액세스
- 네비게이션 바에서 주요 페이지 접근
- 워크스페이스 선택 드롭다운
- 함수 생성 버튼 (워크스페이스 상세 페이지)
