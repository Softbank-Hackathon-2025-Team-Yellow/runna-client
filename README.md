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
# Mock 데이터 사용 여부 (개발 중)
VITE_USE_MOCK_DATA=true

# API 엔드포인트 (프로덕션)
VITE_API_URL=https://api.runna.dev
```

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
├── api/                    # API 클라이언트
├── features/              # 기능별 모듈
│   ├── function-editor/   # 함수 편집기
│   ├── function-detail/   # 함수 상세
│   ├── function-logs/     # 로그 관리
│   ├── gallery/          # 함수 갤러리
│   └── landing/          # 랜딩 페이지
├── pages/                # 페이지 컴포넌트
├── styles/               # 전역 스타일
└── App.tsx              # 앱 진입점
```

## 🎯 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 |
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
