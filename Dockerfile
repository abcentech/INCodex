FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1

# RUN apt-get update && apt-get install -y postgresql-dev gcc python3-dev

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt


# Commented out in favour of creating a docker-compose file

# COPY . .

# CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]