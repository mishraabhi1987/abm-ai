---
name: mcp-dev
description: Start the MCP Inspector to test and debug the MCP server. Use when the user wants to run mcp dev, open the Inspector, or test the MCP server.
disable-model-invocation: true
allowed-tools: Bash(mcp *)
---

## Instructions

Start the MCP Inspector for the MCP server. This is a long-running process, so run it
in the background using `run_in_background: true` — do not run it as a blocking command,
or it will hold the session.

Before starting: ensure the virtual environment is active and `mcp[cli]` is
installed. If Python dependencies are missing, run `pip install -r requirements.txt` first.

Command: `mcp dev server.py`

After starting:

1. Wait a moment, then read the background task output.
2. Confirm the MCP Inspector is up by looking for the startup line in the output
   (it runs on http://localhost:6274). Report the full Inspector URL with the
   auth token exactly as printed in the output, since the token is generated fresh
   each run.
3. Report the background task ID so the user can check or stop it later.
4. If the port is already in use or the server fails to boot, show the error
   and stop — do not retry on a different port.
5. Only if step 2 confirmed the Inspector is actually up, say
   "MCP Inspector started successfully!"
