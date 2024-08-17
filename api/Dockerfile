# api/Dockerfile
FROM python:3.11

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY api/ ./api
COPY .env ./
COPY client_secret.json ./
COPY client_secret_sheets.json ./
#COPY threads_db.db ./
COPY assistant_module ./assistant_module/
COPY nodes ./nodes/

EXPOSE 5000

# Corrected CMD
CMD ["python", "api/chat_api.py"]
