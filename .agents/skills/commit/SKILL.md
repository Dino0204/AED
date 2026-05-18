---
name: commit
description: 변경사항을 논리적 단위로 분리해 프로젝트 컨벤션에 맞는 Git 커밋을 생성합니다.
allowed-tools: Bash
---

## 커밋 메시지 규칙

포맷: `type(scope): 설명`

- **Types**: `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` / `perf` / `ci`
- **Scopes**:
  - `apps/web` 하위 변경 → `web`
  - `infra/` 하위 변경 → `infra`
  - `n8n/` 하위 변경 → `n8n`
  - 루트 전반 또는 여러 영역에 걸친 변경 → `root`
- **설명**: 한국어, 마침표 없음, 금지 어미: `~한다/~된다`, `~하기/~하기 위해`, `~합니다/~됩니다`, `~했습니다`
  - 좋은 예: `GitHub OAuth 콜백 처리 추가`, `nginx 설정 파일 분리`, `n8n 환경변수 주입 방식 변경`
- 제목만 작성 (본문 없음)
- AI 도구를 공동 저자(Co-Authored-By)로 추가하지 않음

## 커밋 플로우

1. 변경사항 파악: `git status`, `git diff`
2. 논리적 단위로 분류 (기능 추가 / 버그 수정 / 리팩토링 등)
3. 단위별로 파일 그룹화
4. 각 그룹마다:
   - `git add <관련 파일들>`
   - 위 규칙에 맞는 커밋 메시지 작성
   - `git commit -m "message"`
5. `git log --oneline -n <개수>`로 결과 확인
