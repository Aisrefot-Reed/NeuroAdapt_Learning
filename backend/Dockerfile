FROM python:3.11-slim

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файл с зависимостями и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все остальные файлы проекта (включая папку app)
COPY . .

# Открываем порт 8000
EXPOSE 8000

# Команда для запуска приложения
# Указываем app.main:app, так как main.py находится в папке app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
