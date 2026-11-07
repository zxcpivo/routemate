#!/usr/bin/env bash
set -euo pipefail

preview_url=http://127.0.0.1:5173/
preview_log=/tmp/routemate-preview.log

if curl -fs --max-time 1 "$preview_url" >/dev/null; then
  exit 0
fi

if [[ -n "${CODESPACE_NAME:-}" && -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]]; then
  export __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS="$CODESPACE_NAME-5173.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN"
fi

nohup npm --prefix frontend run preview -- --host 0.0.0.0 --port 5173 --strictPort \
  </dev/null >"$preview_log" 2>&1 &
preview_pid=$!

for attempt in {1..40}; do
  if curl -fs --max-time 1 "$preview_url" >/dev/null; then
    exit 0
  fi
  if ! kill -0 "$preview_pid" 2>/dev/null; then
    break
  fi
  sleep 0.25
done

cat "$preview_log" >&2
exit 1
