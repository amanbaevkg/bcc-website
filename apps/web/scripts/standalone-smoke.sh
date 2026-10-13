#!/bin/sh
# Starts the self-contained server that the Docker image runs (.next/standalone) on a throwaway
# database and checks that pages and the admin answer. Catches modules missing from the bundle,
# which `next start` (used by the browser tests) does not. Run after `pnpm build`, from apps/web.
set -eu
dir=$(mktemp -d)
# -RP keeps pnpm's links as links (macOS `cp -r` follows them, and the copy then misses modules).
cp -RP .next/standalone "$dir/app"
cp -RP .next/static "$dir/app/apps/web/.next/static"
cp -RP public "$dir/app/apps/web/public"
random() { head -c 24 /dev/urandom | od -An -tx1 | tr -d ' \n'; }
# Node instead of wget/curl: present wherever the server runs (macOS, Alpine, slim images).
answers() {
  node -e 'fetch(process.argv[1]).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))' "$1"
}

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
    if answers "http://127.0.0.1:3999$path"; then ok=1; break; fi
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
