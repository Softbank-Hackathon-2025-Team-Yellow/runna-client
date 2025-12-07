# Function Runner API 문서

## 개요

- **제목**: Function Runner API
- **설명**: 함수 관리 및 실행을 위한 API
- **버전**: 1.0.0
- **OpenAPI 버전**: 3.1.0

## 인증

API는 HTTP Bearer 토큰 인증을 사용합니다. 대부분의 엔드포인트는 인증이 필요합니다.

---

## 엔드포인트

### 사용자 (Users)

#### 1. 사용자 등록
- **엔드포인트**: `POST /users/register`
- **설명**: 새 사용자를 등록합니다
- **인증**: 불필요
- **요청 본문**:
  ```json
  {
    "username": "string",
    "name": "string",
    "password": "string"
  }
  ```
- **응답**: 생성된 사용자 정보
  ```json
  {
    "username": "string",
    "name": "string",
    "id": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
  ```
- **에러**: 사용자명이 이미 존재하는 경우 HTTPException 발생

#### 2. 사용자 로그인
- **엔드포인트**: `POST /users/login`
- **설명**: 사용자 로그인 및 JWT 토큰 발급
- **인증**: 불필요
- **요청 본문**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **응답**: JWT 액세스 토큰
  ```json
  {
    "access_token": "string",
    "token_type": "bearer"
  }
  ```
- **에러**: 인증 실패 시 HTTPException 발생

#### 3. 현재 사용자 정보 조회
- **엔드포인트**: `GET /users/me`
- **설명**: 인증된 현재 사용자의 정보를 조회합니다
- **인증**: 필요 (Bearer Token)
- **응답**: 현재 사용자 정보
  ```json
  {
    "username": "string",
    "name": "string",
    "id": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
  ```

---

### 워크스페이스 (Workspaces)

#### 1. 워크스페이스 목록 조회
- **엔드포인트**: `GET /workspaces/`
- **설명**: 현재 사용자의 워크스페이스 목록을 조회합니다
- **인증**: 필요 (Bearer Token)
- **응답**: 사용자 워크스페이스 목록

#### 2. 워크스페이스 생성
- **엔드포인트**: `POST /workspaces/`
- **설명**: 새 워크스페이스를 생성합니다
- **인증**: 필요 (Bearer Token)
- **요청 본문**:
  ```json
  {
    "name": "string"
  }
  ```
- **응답**: 생성된 워크스페이스 정보

#### 3. 워크스페이스 조회
- **엔드포인트**: `GET /workspaces/{workspace_id}`
- **설명**: 특정 워크스페이스의 정보를 조회합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `workspace_id` (UUID): 워크스페이스 ID
- **응답**: 워크스페이스 정보

#### 4. 워크스페이스 업데이트
- **엔드포인트**: `PUT /workspaces/{workspace_id}`
- **설명**: 워크스페이스 정보를 업데이트합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `workspace_id` (UUID): 워크스페이스 ID
- **요청 본문**:
  ```json
  {
    "name": "string"  // 선택사항
  }
  ```
- **응답**: 업데이트된 워크스페이스 정보

#### 5. 워크스페이스 삭제
- **엔드포인트**: `DELETE /workspaces/{workspace_id}`
- **설명**: 워크스페이스를 삭제합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `workspace_id` (UUID): 워크스페이스 ID
- **응답**: 삭제 성공 응답

#### 6. 워크스페이스 인증키 발급
- **엔드포인트**: `POST /workspaces/{workspace_id}/auth-keys`
- **설명**: 워크스페이스 인증키를 발급합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `workspace_id` (UUID): 워크스페이스 ID
- **요청 본문**:
  ```json
  {
    "expires_hours": 24  // 선택사항, 기본값 24시간
  }
  ```
- **응답**: 워크스페이스 인증키

#### 7. 워크스페이스 메트릭스 조회
- **엔드포인트**: `GET /workspaces/{workspace_id}/metrics`
- **설명**: 워크스페이스의 메트릭스 정보를 조회합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `workspace_id` (UUID): 워크스페이스 ID
- **응답**: 워크스페이스 메트릭스 정보

#### 8. 워크스페이스 함수 목록 조회
- **엔드포인트**: `GET /workspaces/{workspace_id}/functions`
- **설명**: 워크스페이스에 속한 Function 목록을 조회합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `workspace_id` (UUID): 워크스페이스 ID
- **응답**: 워크스페이스 Function 목록

---

### 함수 (Functions)

#### 1. 함수 목록 조회
- **엔드포인트**: `GET /functions/`
- **설명**: 함수 목록을 조회합니다
- **인증**: 필요 (Bearer Token)
- **응답**: 함수 목록

#### 2. 함수 생성
- **엔드포인트**: `POST /functions/`
- **설명**: 새 함수를 생성합니다
- **인증**: 필요 (Bearer Token)
- **요청 본문**:
  ```json
  {
    "name": "string",
    "runtime": "PYTHON" | "NODEJS",
    "code": "string",
    "execution_type": "SYNC" | "ASYNC",
    "workspace_id": "uuid",
    "endpoint": "string"  // 선택사항
  }
  ```
- **응답**: 생성된 함수 정보

#### 3. 함수 조회
- **엔드포인트**: `GET /functions/{function_id}`
- **설명**: 특정 함수의 정보를 조회합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `function_id` (UUID): 함수 ID
- **응답**: 함수 정보

#### 4. 함수 업데이트
- **엔드포인트**: `PUT /functions/{function_id}`
- **설명**: 함수 정보를 업데이트합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `function_id` (UUID): 함수 ID
- **요청 본문**:
  ```json
  {
    "name": "string",  // 선택사항
    "runtime": "PYTHON" | "NODEJS",  // 선택사항
    "code": "string",  // 선택사항
    "execution_type": "SYNC" | "ASYNC",  // 선택사항
    "endpoint": "string"  // 선택사항
  }
  ```
- **응답**: 업데이트된 함수 정보

#### 5. 함수 삭제
- **엔드포인트**: `DELETE /functions/{function_id}`
- **설명**: 함수를 삭제합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `function_id` (UUID): 함수 ID
- **응답**: 삭제 성공 응답

#### 6. 함수 실행 (사용자 인증)
- **엔드포인트**: `POST /functions/{function_id}/invoke`
- **설명**: 사용자 인증을 통한 함수 실행
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `function_id` (UUID): 함수 ID
- **요청 본문**: 임의의 JSON 객체
- **응답**: 함수 실행 결과

#### 7. 함수 실행 (워크스페이스 인증)
- **엔드포인트**: `POST /functions/{function_id}/invoke/workspace`
- **설명**: 워크스페이스 인증을 통한 함수 실행
- **인증**: 필요 (Bearer Token - Workspace Auth Key)
- **경로 파라미터**:
  - `function_id` (UUID): 함수 ID
- **요청 본문**: 임의의 JSON 객체
- **응답**: 함수 실행 결과

#### 8. 함수 작업 목록 조회
- **엔드포인트**: `GET /functions/{function_id}/jobs`
- **설명**: 함수의 작업(실행 이력) 목록을 조회합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `function_id` (UUID): 함수 ID
- **응답**: 함수 작업 목록

#### 9. 함수 메트릭스 조회
- **엔드포인트**: `GET /functions/{function_id}/metrics`
- **설명**: 함수의 메트릭스 정보를 조회합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `function_id` (UUID): 함수 ID
- **응답**: 함수 메트릭스 정보

---

### 작업 (Jobs)

#### 1. 작업 조회
- **엔드포인트**: `GET /jobs/{id}`
- **설명**: 특정 작업의 정보를 조회합니다
- **인증**: 필요 (Bearer Token)
- **경로 파라미터**:
  - `id` (integer): 작업 ID
- **응답**: 작업 정보

---

### 시스템

#### 1. 루트
- **엔드포인트**: `GET /`
- **설명**: API 루트 엔드포인트
- **인증**: 불필요
- **응답**: 기본 응답

#### 2. 헬스 체크
- **엔드포인트**: `GET /health`
- **설명**: API 서버 상태 확인
- **인증**: 불필요
- **응답**: 서버 상태 정보

---

## 데이터 모델

### User (사용자)
```json
{
  "username": "string",
  "name": "string",
  "id": 0,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### UserCreate (사용자 생성)
```json
{
  "username": "string",
  "name": "string",
  "password": "string"
}
```

### UserLogin (사용자 로그인)
```json
{
  "username": "string",
  "password": "string"
}
```

### Token (토큰)
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### WorkspaceCreate (워크스페이스 생성)
```json
{
  "name": "string"
}
```

### WorkspaceUpdate (워크스페이스 업데이트)
```json
{
  "name": "string"  // 선택사항
}
```

### FunctionCreate (함수 생성)
```json
{
  "name": "string",
  "runtime": "PYTHON" | "NODEJS",
  "code": "string",
  "execution_type": "SYNC" | "ASYNC",
  "workspace_id": "uuid",
  "endpoint": "string"  // 선택사항
}
```

### FunctionUpdate (함수 업데이트)
```json
{
  "name": "string",  // 선택사항
  "runtime": "PYTHON" | "NODEJS",  // 선택사항
  "code": "string",  // 선택사항
  "execution_type": "SYNC" | "ASYNC",  // 선택사항
  "endpoint": "string"  // 선택사항
}
```

### Runtime (런타임)
- `PYTHON`: Python 런타임
- `NODEJS`: Node.js 런타임

### ExecutionType (실행 타입)
- `SYNC`: 동기 실행
- `ASYNC`: 비동기 실행

---

## 에러 응답

### HTTPValidationError
```json
{
  "detail": [
    {
      "loc": ["string" | 0],
      "msg": "string",
      "type": "string"
    }
  ]
}
```

### ValidationError
```json
{
  "loc": ["string" | 0],
  "msg": "string",
  "type": "string"
}
```

---

## 사용 예시

### 1. 사용자 등록 및 로그인
```bash
# 사용자 등록
curl -X POST "https://api.example.com/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "name": "John Doe",
    "password": "secure_password"
  }'

# 로그인
curl -X POST "https://api.example.com/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure_password"
  }'
```

### 2. 워크스페이스 생성 및 관리
```bash
# 워크스페이스 생성
curl -X POST "https://api.example.com/workspaces/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Workspace"
  }'

# 워크스페이스 목록 조회
curl -X GET "https://api.example.com/workspaces/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. 함수 생성 및 실행
```bash
# 함수 생성
curl -X POST "https://api.example.com/functions/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "hello_world",
    "runtime": "PYTHON",
    "code": "def handler(event):\n    return {\"message\": \"Hello World\"}",
    "execution_type": "SYNC",
    "workspace_id": "workspace-uuid-here"
  }'

# 함수 실행
curl -X POST "https://api.example.com/functions/{function_id}/invoke" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "test data"
  }'
```
