# API 연결 완료 보고서

## 개요
`.env` 파일에서 `VITE_USE_MOCK_DATA=false`로 설정 시 실제 API (`https://runna-api.ajy720.me`)에서 데이터를 가져오도록 모든 페이지를 업데이트했습니다.

## 환경 설정

### .env 파일
```env
VITE_USE_MOCK_DATA=false
VITE_API_URL=https://runna-api.ajy720.me
```

## 업데이트된 페이지

### 1. CreateFunctionPage
**파일**: `src/pages/CreateFunctionPage.tsx`

#### 변경사항:
- `api` import 추가
- `handleDeploy` 함수에서 실제 API 호출 구현
- TODO 주석 제거
- 함수 생성 후 실제 function ID를 사용하여 URL 생성

#### API 호출:
```typescript
const createdFunction = await api.functions.createFunction({ 
  name, 
  runtime: runtime === 'Node.js' ? 'NODEJS' : 'PYTHON',
  code, 
  execution_type: 'SYNC', 
  workspace_id: workspaceId,
  ...(endpoint && { endpoint })
})
```

### 2. WorkspaceDetailPage
**파일**: `src/pages/WorkspaceDetailPage.tsx`

#### 변경사항:
- `handleDeleteWorkspace` 함수에서 실제 API 호출 구현
- `handleCopyAuthKey` 함수에서 실제 auth key 생성 API 호출
- TODO 주석 제거

#### API 호출:
```typescript
// 워크스페이스 삭제
await api.workspaces.deleteWorkspace(workspaceId)

// Auth Key 생성
const authKeyData = await api.workspaces.generateAuthKey(workspaceId)
```

### 3. FunctionDetailPage
**파일**: `src/pages/FunctionDetailPage.tsx`

#### 변경사항:
- Mock 데이터 import 제거
- 실제 API 타입 사용 (`FunctionDetail`, `FunctionMetrics`, `Job`)
- `fetchData` 함수 완전 재작성
- 모든 데이터를 실제 API에서 가져오도록 구현
- Job 타입 필드명 수정 (`job_id` → `id`, `timestamp` → `created_at`, `result` → `output`)
- Status 값 수정 (`succeeded` → `success`, `failed` → `error`)
- Metrics 구조 변경 (API 스펙에 맞게)

#### API 호출:
```typescript
const [functionData, metricsData, jobsData] = await Promise.all([
  api.functions.getFunction(Number(functionId)),
  api.functions.getMetrics(Number(functionId)),
  api.functions.getJobs(Number(functionId))
])
```

## API 서비스 구조

모든 API 서비스는 이미 실제 API와 연결되도록 구현되어 있습니다:

### 사용자 서비스 (`user.service.ts`)
- ✅ `register(user)` - POST /users/register
- ✅ `login(credentials)` - POST /users/login
- ✅ `getCurrentUser()` - GET /users/me

### 워크스페이스 서비스 (`workspace.service.ts`)
- ✅ `getWorkspaces()` - GET /workspaces/
- ✅ `getWorkspace(id)` - GET /workspaces/{id}
- ✅ `createWorkspace(data)` - POST /workspaces/
- ✅ `updateWorkspace(id, data)` - PUT /workspaces/{id}
- ✅ `deleteWorkspace(id)` - DELETE /workspaces/{id}
- ✅ `generateAuthKey(id, hours)` - POST /workspaces/{id}/auth-keys
- ✅ `getMetrics(id)` - GET /workspaces/{id}/metrics
- ✅ `getFunctions(id)` - GET /workspaces/{id}/functions

### 함수 서비스 (`function.service.ts`)
- ✅ `getFunctions()` - GET /functions/
- ✅ `getFunction(id)` - GET /functions/{id}
- ✅ `createFunction(data)` - POST /functions/
- ✅ `updateFunction(id, data)` - PUT /functions/{id}
- ✅ `deleteFunction(id)` - DELETE /functions/{id}
- ✅ `invokeFunction(id, payload)` - POST /functions/{id}/invoke
- ✅ `invokeFunctionWithWorkspaceAuth(id, payload)` - POST /functions/{id}/invoke/workspace
- ✅ `getJobs(id)` - GET /functions/{id}/jobs
- ✅ `getMetrics(id)` - GET /functions/{id}/metrics

### 작업 서비스 (`job.service.ts`)
- ✅ `getJob(id)` - GET /jobs/{id}

## HTTP 클라이언트 설정

**파일**: `src/api/http.ts`

### 기능:
- ✅ Base URL 설정 (`VITE_API_URL`)
- ✅ 자동 Bearer Token 인증
- ✅ 에러 처리 및 변환
- ✅ 401 에러 시 자동 로그아웃
- ✅ 네트워크 에러 처리

### 인터셉터:
```typescript
// Request Interceptor - 자동으로 토큰 추가
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor - 에러 처리
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러 시 자동 로그아웃
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(apiError)
  }
)
```

## 타입 안정성

모든 API 호출은 TypeScript 타입으로 보호됩니다:
- ✅ 요청 파라미터 타입 검증
- ✅ 응답 데이터 타입 검증
- ✅ 에러 타입 정의
- ✅ 모든 페이지에서 TypeScript 오류 없음

## 테스트 방법

### 1. Mock 데이터로 테스트
```env
VITE_USE_MOCK_DATA=true
```

### 2. 실제 API로 테스트
```env
VITE_USE_MOCK_DATA=false
VITE_API_URL=https://runna-api.ajy720.me
```

### 3. 로컬 API로 테스트
```env
VITE_USE_MOCK_DATA=false
VITE_API_URL=http://localhost:8000
```

## 주의사항

### CORS 설정
실제 API 서버에서 CORS를 허용해야 합니다:
```python
# FastAPI 예시
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 인증 토큰
- 로그인 성공 시 `localStorage`에 토큰 저장
- 모든 API 요청에 자동으로 Bearer Token 추가
- 401 에러 시 자동으로 로그인 페이지로 리다이렉트

### 에러 처리
- 네트워크 에러: "Network error: Unable to connect to the server"
- 클라이언트 에러 (4xx): API에서 반환한 에러 메시지 표시
- 서버 에러 (5xx): "Server error: Please try again later"

## 다음 단계

### 추가 구현 필요:
- [ ] Function 업데이트 페이지 구현
- [ ] Function 삭제 기능 UI 추가
- [ ] Workspace 업데이트 기능 UI 추가
- [ ] 더 나은 에러 메시지 UI
- [ ] 로딩 스피너 개선
- [ ] 재시도 로직 추가

### 최적화:
- [ ] API 응답 캐싱
- [ ] 낙관적 업데이트 (Optimistic Updates)
- [ ] 무한 스크롤 또는 페이지네이션
- [ ] 실시간 업데이트 (WebSocket)

## 결론

모든 페이지가 실제 API와 완전히 연결되었습니다. `.env` 파일에서 `VITE_USE_MOCK_DATA=false`로 설정하면 즉시 실제 API를 사용할 수 있습니다.
