# Dockerfile для Django
# Обновлен базовый образ
FROM python:3.11-alpine

WORKDIR /app/calendar

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

COPY requirements.txt .

RUN apk add zlib-dev jpeg-dev gcc musl-dev

RUN pip install --no-cache-dir -r requirements.txt