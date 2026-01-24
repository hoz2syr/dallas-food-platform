#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="infra/docker-compose.yml"

cleanup() {
  docker compose -f "$COMPOSE_FILE" down
}
trap cleanup EXIT

echo "Bringing up compose stack..."
docker compose -f "$COMPOSE_FILE" up --build -d

echo "Waiting for Menu service at http://localhost:3001/menus"
MAX_ATTEMPTS=60
SLEEP_SECONDS=2
attempt=0
until [ $attempt -ge $MAX_ATTEMPTS ]; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:3001/menus" -H "Content-Type: application/json" -d '{"menuId":"smoke1","name":"Smoke","items":[{"id":"i1","name":"Item","price":1}]}' || true)
  if [ "$HTTP_CODE" = "200" ]; then
    echo "Menu service is responsive"
    break
  fi
  attempt=$((attempt+1))
  sleep $SLEEP_SECONDS
done

if [ $attempt -ge $MAX_ATTEMPTS ]; then
  echo "Menu service did not become responsive after $((MAX_ATTEMPTS * SLEEP_SECONDS)) seconds"
  exit 1
fi

echo "Running smoke tests: valid payload -> expect 200"
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:3001/menus" -H "Content-Type: application/json" -d '{"menuId":"smoke-valid","name":"Smoke","items":[{"id":"i1","name":"Item","price":1}]}' )
if [ "$CODE" != "200" ]; then
  echo "Expected 200 for valid payload, got $CODE"
  exit 1
fi

echo "Running smoke tests: invalid payload (empty items) -> expect 400"
CODE_BAD=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:3001/menus" -H "Content-Type: application/json" -d '{"menuId":"smoke-invalid","name":"Bad","items":[]}' )
if [ "$CODE_BAD" != "400" ]; then
  echo "Expected 400 for invalid payload, got $CODE_BAD"
  exit 1
fi

echo "E2E smoke tests passed"
