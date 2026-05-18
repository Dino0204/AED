---
name: pull-request
description: 프로젝트 컨벤션에 맞는 PR 제목과 본문을 생성하고, main 브랜치를 대상으로 GitHub Draft PR을 생성합니다.
allowed-tools: Bash
---

# Pull Request

현재 브랜치의 PR을 생성할 때 사용합니다.

## 사전 조건

1. 저장소 상태 확인:
   - `git status -sb`
   - `git branch --show-current`
   - `git remote -v`
2. GitHub CLI 확인:
   - `gh --version`
   - `gh auth status`
3. `gh`가 없거나 인증되지 않았으면 중단하고 사용자에게 안내

## 브랜치 및 diff 규칙

1. 기본 대상 브랜치는 `main`
2. 현재 브랜치가 `main`이면 중단하고 작업 브랜치 생성을 안내
3. PR 초안 작성 전 컨텍스트 파악:
   - `git log origin/main..HEAD --oneline 2>/dev/null || git log --oneline -15`
   - `git diff origin/main...HEAD --stat 2>/dev/null || git diff HEAD~5...HEAD --stat`
   - `git diff origin/main...HEAD 2>/dev/null || git diff HEAD~5...HEAD`

## 제목 규칙

포맷: `[scope] 한국어 설명`

허용 scope:
- `[web]` — `apps/web` 변경
- `[infra]` — `infra/` 변경
- `[n8n]` — `n8n/` 변경
- `[root]` — 루트 전반 또는 여러 영역에 걸친 변경
- `[ci]` — CI/CD 워크플로우 변경

규칙:
- 가장 좁은 scope 사용
- 기술 식별자는 백틱으로 감싸기
- 이모지 사용 금지

## 본문 규칙

```md
## 개요

...

## 본문

...
```

1. 실제 diff와 커밋 내역 기반으로 작성 (파일 목록 나열 금지)
2. `개요`: 1~3문장
3. `본문`: 변경 내용과 이유를 상세히
4. 한국어 `~하였습니다` 체
5. 이모지 사용 금지
6. 기술 식별자는 백틱으로 감싸기
7. 전체 2500자 이내

## 생성 플로우

1. 브랜치와 diff 컨텍스트 확인
2. 제목과 본문 생성
3. 생성 전 미리보기 출력
4. Draft PR 생성:

```bash
gh pr create --draft --title "<제목>" --base main --body "$(cat <<'EOF'
## 개요

<내용>

## 본문

<내용>
EOF
)"
```

5. PR URL, 제목, 대상 브랜치 보고

## 안전 규칙

- 헤딩 `## 개요` / `## 본문` 절대 변경 금지
- 제목 포맷 `[scope] 한국어 설명` 반드시 준수
- 본문 2500자 초과 금지
- `main` 브랜치에서 PR 생성 금지
- 사용자가 명시적으로 요청하지 않는 한 Draft 상태로 생성
