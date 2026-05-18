**한국어로 응답하고 작업하세요.**

# AED (Always Ever-growing Document)

GitHub 기반 포트폴리오를 n8n 워크플로우와 AI로 주기적으로 분석하고, 사용자의 큐레이션 결정 이력을 축적하는 개인용 포트폴리오 유지보수 시스템.

## 프로젝트 구조

```
aed/
├── apps/
│   └── web/          # Next.js 16 + React 19 (TypeScript, Tailwind CSS v4)
├── infra/
│   ├── nginx/        # 리버스 프록시 설정
│   └── docker-compose.yml
├── n8n/
│   └── workflows/    # collect.json, analyze.json, bootstrap.json
└── package.json      # bun 워크스페이스 루트
```

## 기술 스택

- **프론트엔드**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **런타임/패키지 매니저**: Bun
- **워크플로우**: n8n (Docker)
- **인프라**: nginx, Docker Compose

## 코딩 컨벤션

### 공통
- 언어: 한국어로 커밋 설명, 주석, PR 본문 작성
- 변수/함수명: 영어 camelCase
- 컴포넌트: PascalCase

### Next.js (`apps/web`)
- App Router 사용 (`src/app/`)
- 서버 컴포넌트 우선, 클라이언트 컴포넌트는 `"use client"` 명시
- 환경변수: `src/lib/env.ts`에서 Zod로 검증 후 사용
- API Route: `src/app/api/` 하위

### n8n
- Code 노드 sandbox 제약에 주의 (외부 모듈 사용 불가)
- `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` 환경에서 실행

## 브랜치 전략

Git Flow 변형 전략 사용.

```
main (프로덕션)
  ↑
  └─ develop (개발 베이스) ← PR merge 대상
       ↑
       ├─ feat/<설명>
       ├─ fix/<설명>
       ├─ refactor/<설명>
       └─ chore/<설명>
```

- 브랜치명: `type/kebab-case-설명` 형식 (소문자, 하이픈 구분)
- 모든 작업 브랜치는 `develop`에서 분기하고 `develop`으로 PR
- `main` ← `develop` merge는 릴리즈 시점에만

**예시**: `feat/github-oauth`, `fix/n8n-env-parsing`, `chore/nginx-config`

## 커밋 컨벤션

포맷: `type(scope): 설명`

- **Types**: `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` / `perf` / `ci`
- **Scopes**:
  - `apps/web` 하위 → `web`
  - `infra/` 하위 → `infra`
  - `n8n/` 하위 → `n8n`
  - 루트 전반 → `root`
- **설명**: 한국어, 마침표 없음, `~한다/~됩니다/~했습니다` 어미 금지
  - 좋은 예: `GitHub OAuth 콜백 처리 추가`, `n8n 워크플로우 환경변수 분리`
- 본문 없이 제목만
- AI 도구를 공동 저자로 추가하지 않음
