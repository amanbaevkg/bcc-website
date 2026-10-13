#!/bin/sh
# Starts the self-contained server that the Docker image runs (.next/standalone) on a throwaway
# database and checks that pages and the admin answer. Catches modules missing from the bundle,
# which `next start` (used by the browser tests) does not. Run after `pnpm build`, from apps/web.
set -eu
dir=$(mktemp -d)
cp -r .next/standalone "$dir/app"
cp -r .next/static "$dir/app/apps/web/.next/static"
cp -r public "$dir/app/apps/web/public"
random() { head -c 24 /dev/urandom | od -An -tx1 | tr -d ' \n'; }

cd "$dir/app"
NODE_ENV=production PORT=3999 HOSTNAME=127.0.0.1 SITE_URL=http://127.0.0.1:3999 \
  DATABASE_URL="file:$dir/payload.db" PAYLOAD_MEDIA_DIR="$dir/media" PAYLOAD_SEED=false \
  PAYLOAD_SECRET="$(random)" PAYLOAD_ADMIN_EMAIL=smoke@example.invalid PAYLOAD_ADMIN_PASSWORD="$(random)" \
  node apps/web/server.js > "$dir/server.log" 2>&1 &
pid=$!
trap 'kill $pid 2>/dev/null || true; rm -rf "$dir"' EXIT

for path in /en /admin; do
  ok=
  for _ in $(seq 1 60); do
    if wget -qO /dev/null "http://127.0.0.1:3999$path"; then ok=1; break; fi
    kill -0 $pid 2>/dev/null || break
    sleep 2
  done
  if [ -z "$ok" ]; then
    echo "standalone server: $path did not answer"
    cat "$dir/server.log"
    exit 1
  fi
  echo "standalone server: $path OK"
done
