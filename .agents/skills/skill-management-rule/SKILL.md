---
name: skill-management-rule
description: 스킬 파일 관리 규칙. 스킬 추가·수정·삭제 및 .agents/.claude 디렉토리 구조에 대한 질문 시 적용.
---

# 스킬 관리 규칙

> **항상 `.agents/`에 먼저 작성하고, `.claude/`에 심볼릭 링크를 생성합니다.**

`.agents/`가 원본, `.claude/`가 Claude Code가 읽는 진입점입니다.  
`.claude/`에 직접 파일을 작성하지 마세요.

## 새 스킬 추가

```bash
mkdir -p .agents/skills/<skill-name>
# SKILL.md 작성 후:
ln -s ../../.agents/skills/<skill-name> .claude/skills/<skill-name>
```

## 기존 스킬 수정

`.agents/skills/<skill-name>/` 안의 파일을 직접 편집합니다.  
심볼릭 링크를 통해 `.claude/`에 자동 반영됩니다.

## 스킬 삭제

```bash
rm .claude/skills/<skill-name>
rm -rf .agents/skills/<skill-name>
```

## 링크 확인

```bash
ls -la .claude/skills/<skill-name>
# 기대 결과: .claude/skills/<skill-name> -> ../../.agents/skills/<skill-name>
```
