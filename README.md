# <img src="public/logo.png" alt="Runna Logo" height="40" align="center" /> Runna

> Serverless Function Management Platform - SoftBank Hackathon 2025, Yellow Team

Runna는 서버리스 함수를 쉽게 생성, 배포, 관리할 수 있는 웹 기반 플랫폼입니다. 직관적인 코드 에디터와 실시간 테스트 환경을 제공하여 개발자가 빠르게 함수를 개발하고 배포할 수 있습니다.

## ✨ 주요 기능

### 📝 Function Editor
- **Monaco Editor 기반**: VS Code와 동일한 편집 경험
- **멀티 런타임 지원**: Node.js, Python
- **실시간 테스트**: 코드 작성과 동시에 테스트 가능
- **자동 저장**: 변경사항 자동 감지 및 저장
- **스마트 하이라이트**: 변경사항 있을 때 Save 버튼 깜빡임, 저장 후 Deploy 버튼 강조

### 🎨 사용자 경험
- **다크 테마**: 눈에 편안한 커스텀 다크 테마
- **포커스 효과**: 작업 중인 영역을 명확하게 표시
- **부드러운 애니메이션**: 모든 인터랙션에 자연스러운 전환 효과
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화

### 📊 모니터링 & 로깅
- **실행 메트릭**: CPU, 메모리 사용량, 실행 시간 추적
- **성공률 분석**: 함수 실행 성공/실패 통계
- **상세 로그**: 모든 실행 기록 조회 및 필터링
- **Export 기능**: 로그 데이터 JSON 형식으로 내보내기

### 🔍 Function Gallery
- **함수 목록**: 모든 배포된 함수 한눈에 보기
- **검색 & 필터**: 빠른 함수 찾기
- **실시간 새로고침**: 최신 상태 즉시 반영
- **상태 표시**: 각 함수의 실행 상태 시각화

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빠른 개발 환경
- **React Router** - 클라이언트 사이드 라우팅

### UI/UX
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Monaco Editor** - 코드 에디터
- **Lucide React** - 아이콘 라이브러리
- **React Resizable Panels** - 분할 레이아웃

### State Management
- **Zustand** - 경량 상태 관리
- **React Query** - 서버 상태 관리

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/Softbank-Hackathon-2025-Team-Yellow/runna-client.git
cd runna-client

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
# Mock 데이터 사용 여부
# true: Mock 데이터 사용 (개발 환경)
# false: 실제 API 사용 (프로덕션 환경)
VITE_USE_MOCK_DATA=true

# API 엔드포인트 (VITE_USE_MOCK_DATA=false일 때 사용)
VITE_API_URL=https://api.runna.dev
```

#### Mock 데이터 vs 실제 API

**개발 환경 (Mock 데이터)**
```env
VITE_USE_MOCK_DATA=true
VITE_API_URL=
```
- 백엔드 없이 프론트엔드 개발 가능
- 빠른 프로토타이핑 및 UI 테스트
- Mock 데이터는 `src/api/mock/` 폴더에 위치

**프로덕션 환경 (실제 API)**
```env
VITE_USE_MOCK_DATA=false
VITE_API_URL=https://your-backend-api.com
```
- 실제 백엔드 API와 연동
- 모든 CRUD 작업이 실제 데이터베이스에 반영
- JWT 인증 토큰 자동 관리

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 📁 프로젝트 구조

```
src/
├── api/                    # API 레이어
│   ├── types/             # TypeScript 타입 정의
│   ├── services/          # 실제 API 서비스
│   ├── mock/              # Mock 데이터 서비스
│   └── http.ts            # Axios HTTP 클라이언트
├── features/              # 기능별 모듈
│   ├── function-editor/   # 함수 편집기
│   ├── function-detail/   # 함수 상세
│   ├── function-logs/     # 로그 관리
│   ├── gallery/          # 함수 갤러리
│   └── landing/          # 랜딩 페이지
├── hooks/                # 공통 React 훅
├── pages/                # 페이지 컴포넌트
├── components/           # 공통 UI 컴포넌트
├── styles/               # 전역 스타일
└── App.tsx              # 앱 진입점
```

## 🔌 API 연동

### API 아키텍처

프로젝트는 **서비스 레이어 패턴**을 사용하여 Mock 데이터와 실제 API를 쉽게 전환할 수 있습니다.

```
Components → Hooks → Service Factory → Mock/Real Services → API
```

### 서비스 구조

```typescript
// src/api/services/index.ts
export const api = {
  users: USE_MOCK_DATA ? mockUserService : userService,
  workspaces: USE_MOCK_DATA ? mockWorkspaceService : workspaceService,
  functions: USE_MOCK_DATA ? mockFunctionService : functionService,
  jobs: USE_MOCK_DATA ? mockJobService : jobService,
}
```

### 사용 예시

```typescript
// 컴포넌트에서 API 사용
import { api } from '@/api/services'

// 함수 목록 조회
const functions = await api.functions.getFunctions()

// 함수 생성
const newFunction = await api.functions.createFunction({
  name: 'My Function',
  runtime: 'nodejs',
  code: 'exports.handler = async () => {}',
  execution_type: 'sync',
  workspace_id: 'workspace-uuid'
})

// 함수 실행
const result = await api.functions.invokeFunction(functionId, { key: 'value' })
```

### 인증

JWT 토큰은 자동으로 관리됩니다:
- 로그인 시 `localStorage`에 저장
- 모든 API 요청에 자동으로 포함
- 401 에러 시 자동으로 로그인 페이지로 리다이렉트

### 에러 처리

```typescript
try {
  const data = await api.functions.getFunction(id)
} catch (error) {
  // ApiError 타입으로 변환됨
  console.error(error.message)  // 사용자 친화적 메시지
  console.error(error.status)   // HTTP 상태 코드
  console.error(error.detail)   // 상세 에러 정보
}
```

## 🎯 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 |
| `/login` | 로그인 |
| `/register` | 회원가입 |
| `/workspaces` | 워크스페이스 목록 |
| `/workspaces/:id` | 워크스페이스 상세 |
| `/gallery` | 함수 갤러리 (대시보드) |
| `/create` | 새 함수 생성 |
| `/edit/:id` | 함수 편집 |
| `/functions/:id` | 함수 상세 정보 |
| `/functions/:id/logs` | 함수 실행 로그 |

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: `#fece6d` (노란색)
- **Background**: `#0a0a0a` (다크)
- **Surface**: `#1e1e1e`
- **Text**: `#ffffff` (화이트)

### 타이포그래피
- **Heading**: Pixel 폰트
- **Body**: System 폰트
- **Code**: JetBrains Mono, Fira Code

## 🚀 AWS Amplify 배포

### GitHub를 통한 자동 배포

1. **AWS Amplify Console 접속**
   - [AWS Amplify Console](https://console.aws.amazon.com/amplify/) 접속
   - "New app" → "Host web app" 클릭

2. **GitHub 연결**
   - "GitHub" 선택
   - 저장소 권한 승인
   - `runna-client` 저장소 선택
   - 배포할 브랜치 선택 (예: `main`)

3. **빌드 설정 확인**
   - Amplify가 자동으로 `amplify.yml` 파일 감지
   - 빌드 설정이 올바른지 확인

4. **환경 변수 설정**
   - "Environment variables" 섹션에서 추가:
   ```
   VITE_USE_MOCK_DATA=false
   VITE_API_URL=https://your-api-url.com
   ```

5. **배포 시작**
   - "Save and deploy" 클릭
   - 자동으로 빌드 및 배포 시작

### 배포 후 자동 업데이트

- `main` 브랜치에 push하면 자동으로 재배포
- PR 생성 시 프리뷰 환경 자동 생성 (선택사항)

### 커스텀 도메인 설정

1. Amplify Console에서 "Domain management" 선택
2. "Add domain" 클릭
3. 도메인 입력 및 DNS 설정 완료

## 🔧 개발 가이드

### Mock 데이터 사용

개발 중에는 `.env`에서 `VITE_USE_MOCK_DATA=true`로 설정하여 Mock 데이터를 사용할 수 있습니다.

Mock 데이터 파일:
- `src/features/gallery/data/mockFunctions.ts`
- `src/features/function-detail/data/mockFunctionDetail.ts`
- `src/features/function-logs/data/mockLogs.ts`

### 코드 스타일

```bash
# Lint 실행
npm run lint
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 SoftBank Hackathon 2025의 일환으로 개발되었습니다.

## 👥 팀

**Yellow Team** - SoftBank Hackathon 2025

## 📞 문의

- GitHub: [Softbank-Hackathon-2025-Team-Yellow](https://github.com/Softbank-Hackathon-2025-Team-Yellow)
- Documentation: [Notion](https://www.notion.so/ajy720/SoftBank-Hackathon-2025-Team-Yellow-2b9a0048876b80359945da260b4bc659)

---

Made with ❤️ by Yellow Team


## 🔍 Amplify 배포 트러블슈팅

### 배포가 실패하는 경우

1. **빌드 로그 확인**
   - Amplify Console에서 "Build logs" 확인
   - 에러 메시지 확인

2. **로컬에서 빌드 테스트**
   ```bash
   npm run build
   ls -la dist/  # index.html이 있는지 확인
   ```

3. **일반적인 문제 해결**
   
   **문제**: `dist` 폴더가 비어있음
   ```bash
   # package.json의 build 스크립트 확인
   "build": "tsc && vite build"
   ```
   
   **문제**: 환경 변수 누락
   - Amplify Console에서 환경 변수 설정 확인
   - `.env.example` 파일 참고
   
   **문제**: Node 버전 불일치
   - Amplify Console → Build settings → Build image settings
   - Node.js 18.x 선택

4. **빌드 설정 확인**
   ```yaml
   # amplify.yml 확인
   artifacts:
     baseDirectory: dist  # Vite의 기본 출력 디렉토리
   ```

5. **라우팅 문제 (404 에러)**
   - `public/_redirects` 파일이 있는지 확인
   - SPA 라우팅을 위한 리다이렉트 설정 필요

### 빌드 성공 체크리스트
- [ ] `npm run build` 로컬에서 성공
- [ ] `dist/index.html` 파일 존재
- [ ] 환경 변수 설정 완료
- [ ] `amplify.yml` 파일 존재
- [ ] `public/_redirects` 파일 존재

### 배포 후 확인사항
- [ ] 메인 페이지 로딩 확인
- [ ] 라우팅 동작 확인 (새로고침 시 404 없음)
- [ ] 환경 변수 적용 확인
- [ ] API 연결 확인 (프로덕션 환경)
