#!/bin/bash
set -e

# Run migrations
python manage.py migrate --noinput

# Execute the main command
exec "$@"