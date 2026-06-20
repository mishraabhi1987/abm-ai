---
name: backend-run
description: Start the FastAPI backend dev server for this project. Use when the user wants to run, start, or boot the backend / API server.
disable-model-invocation: true
allowed-tools: Bash(uvicorn *)
---

## Instructions

Start the FastAPI backend. This is a long-running dev server, so run it in the
background using `run_in_background: true` — do not run it as a blocking command,
or it will hold the session.

Command: `uvicorn main:app --reload`

After starting:

1. Wait a moment, then read the background task output.
2. Confirm the server is up by looking for the Uvicorn startup line
   (it should report running on http://127.0.0.1:8000).
3. Report the background task ID so the user can check or stop it later.
4. If the port is already in use or the server fails to boot, show the error
   and stop — do not retry on a different port.
5. Only if step 2 confirmed the server is actually up, say "Backend server started successfully!"
