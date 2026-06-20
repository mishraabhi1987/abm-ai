#!/bin/bash
# PostToolUse hook: auto-formats a Python file after Claude writes/edits it.

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Only act on .py files
if echo "$file_path" | grep -q '\.py$'; then
  if command -v black >/dev/null 2>&1; then
    black "$file_path"
    echo "Formatted $file_path with black." >&2
  fi
fi

exit 0