---
name: backend-run
description: Start the FastAPI backend dev server for this project. Use when the user wants to run, start, or boot the backend / API server.
disable-model-invocation: true
allowed-tools: Bash(uvicorn *), Bash(cat *), Read
---

## Instructions

Start both FastAPI backend servers. Each is a long-running dev server, so run
them in the background using `run_in_background: true` — do not run them as
blocking commands, or they will hold the session.

**Server 1 — Main app:** `uvicorn main:app --reload` (port 8000)
**Server 2 — Agent server:** `uvicorn agent_server:app --reload --port 8001` (port 8001)

Launch both background commands, then:

1. Wait a moment, then read both background task output files.
2. Confirm each server is up by looking for its Uvicorn startup line:
   - main app: `Uvicorn running on http://127.0.0.1:8000`
   - agent server: `Uvicorn running on http://127.0.0.1:8001`
3. Report both background task IDs so the user can check or stop them later.
4. If either port is already in use or a server fails to boot, show the error
   and stop — do not retry on a different port.
5. Only if both servers confirmed up, say "Backend servers started successfully!"
