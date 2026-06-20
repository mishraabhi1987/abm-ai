---
name: frontend-run
description: Start the React frontend dev server for this project. Use when the user wants to run, start, or boot the frontend / UI / web app.
disable-model-invocation: true
allowed-tools: Bash(npm *)
---

## Instructions

Start the React frontend. This is a long-running dev server, so run it in the
background using `run_in_background: true` — do not run it as a blocking command,
or it will hold the session.

Before starting: if `node_modules` is missing, run `npm install` first.

Command: `npm run dev`

After starting:

1. Wait a moment, then read the background task output.
2. Confirm the server is up by looking for the Vite startup line
   (running on Local: http://localhost:5173/).
3. Report the background task ID so the user can check or stop it later.
4. If the port is already in use or the server fails to boot, show the error
   and stop — do not retry on a different port.
5. Only if step 2 confirmed the server is actually up, say "Frontend server started successfully!"
