FROM python:3.11-slim AS builder

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    && pip install -U setuptools \
    && pip install --upgrade pip setuptools wheel \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/calendar

COPY /backend/requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /app/calendar/wheels -r requirements.txt

FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=8000

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    libpq-dev \
    libjpeg62-turbo \
    zlib1g \
    libpng16-16 \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 appuser \
    && mkdir -p /app/calendar/staticfiles /app/calendar/media \
    && chown -R appuser:appuser /app

COPY --from=builder /app/calendar/wheels /wheels
COPY --from=builder /app/calendar/requirements.txt .
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt \
    && pip install setuptools \
    && rm -rf /wheels requirements.txt

WORKDIR /app/calendar
COPY --chown=appuser:appuser backend/. .

COPY /backend/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Avoiding root
USER appuser
# WORKDIR /app/calendar

# Collect static
#RUN python manage.py collectstatic --noinput

EXPOSE ${PORT}

# Put migration inside this file
#ENTRYPOINT ["./entrypoint.sh"]

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "dates_pr_cbs.wsgi:application"]