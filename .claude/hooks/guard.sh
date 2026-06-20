#!/bin/bash
# PreToolUse hook (matcher: Bash) — blocks destructive shell commands.
# Reads the tool call JSON from stdin, inspects tool_input.command.

input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // empty')

# Dangerous patterns — extend as needed
if echo "$command" | grep -qE 'rm\s+-[rf]{2,}\s+|rm\s+-r\s+-f\s+|rm\s+-f\s+-r\s+|git push (--force|--force-with-lease)|git reset --hard|DROP (TABLE|DATABASE)|sudo rm|mkfs|:\(\)\{'; then
  echo "Blocked: this command looks destructive and was stopped by guard.sh. Review it manually." >&2
  exit 2
fi

exit 0