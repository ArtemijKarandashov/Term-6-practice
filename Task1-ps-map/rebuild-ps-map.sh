#!/bin/bash
set -e

# rebuild-ps-map.sh — пересборка ps-map без переустановки зависимостей
# Оптимизировано для работы в cron

# Абсолютные пути
APP_DIR="/app"
LOG_FILE="/var/log/cron/ps-map.log"

# Добавляем путь к бинарям Node и npm
export PATH=$PATH:/app/node_modules/.bin

# Переходим в рабочую директорию
if [ ! -d "$APP_DIR" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] Directory $APP_DIR not found!" >> "$LOG_FILE"
  exit 1
fi
cd "$APP_DIR"

# Чистим том (Страшно)
find "$APP_DIR/dist" -delete >> "$LOG_FILE"

# Проверяем наличие package.json
if [ ! -f "$APP_DIR/package.json" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] package.json not found in $APP_DIR" >> "$LOG_FILE"
  exit 1
fi

# Проверяем наличие node_modules
if [ ! -d "$APP_DIR/node_modules" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') [WARN] node_modules not found! Trying to install dependencies with npm ci..." >> "$LOG_FILE"
  npm ci
fi

if [ ! -d "$APP_DIR/node_modules" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] node_modules not found! Skipping rebuild to avoid errors." >> "$LOG_FILE"
  exit 1
fi

# Начало сборки
echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] Starting site rebuild..." >> "$LOG_FILE"

# Сборка проекта (gulp)

npm run build >> "$LOG_FILE" 2>&1

# Проверяем результат
if [ -d "$APP_DIR/dist" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] Build completed successfully. Output: $APP_DIR/dist" >> "$LOG_FILE"
else
  echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] dist directory not found after build!" >> "$LOG_FILE"
  exit 1
fi

echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] Rebuild finished." >> "$LOG_FILE"

# Архивация данных (tar.gz)
echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] Archivation started..." >> "$LOG_FILE"

find "$APP_DIR/build" -type f -mtime +30 -name "build_*" -delete >> "$LOG_FILE"

ARCHIVE_NAME="$APP_DIR/build/build_$(date '+%Y-%m-%d_%H:%M:%S').tar.gz"
tar -zcf "$ARCHIVE_NAME" -C "$APP_DIR/dist" . >> "$LOG_FILE"

if [ -f "$ARCHIVE_NAME" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] Archivation completed successfully." >> "$LOG_FILE"
else
  echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] Archive not found! Archivation failed?" >> "$LOG_FILE"
  exit 1
fi

# Отправка данных с помощью scp
echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] Sending archive through ssh..." >> "$LOG_FILE"

scp "-i" "${SSH_KEY_PATH}" "-o" "StrictHostKeyChecking=no" "-o" "UserKnownHostsFile=/dev/null" "$ARCHIVE_NAME" "${HOST_PATH}" >> "$LOG_FILE"

if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] Archive sended successfully."
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] Something went wrong upon sending archive."
    exit 1
fi