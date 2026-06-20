---
name: code-review
description: Reviews code changes for bugs, security, error handling, UI issues, and quality. Use when the user asks to review code, review a diff, check their code, or do a code review.
allowed-tools: Bash(git *), Read
---

## Tracked changes (modified files)

!`git diff HEAD`

## New untracked files

!`git ls-files --others --exclude-standard`

## Instructions

Review ALL the changes above — both the tracked diff and the new untracked files.
For untracked files, read their full contents with the Read tool before reviewing,
since only their paths are listed above (not their content).

Review as an experienced engineer. Cover these areas:

1. **Bugs & logic errors** — anything that will break at runtime or produce wrong output.
2. **Security** — hardcoded secrets, unvalidated input, injection risks.
3. **Error handling** — missing try/catch, unhandled edge cases, silent failures.
4. **UI/UX** (if frontend) — anything that breaks layout, accessibility, or responsiveness.
5. **Tests** — what needs a new or updated test.
6. **Code quality** — naming, duplication, readability.

For each issue: state the file/line, why it's a problem, and a concrete fix.
Prioritize by severity (critical → minor). If there are no changes, say so.
