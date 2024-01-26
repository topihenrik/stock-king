# SETUP FRONTEND
FROM node:20 as frontend-build
WORKDIR /app
COPY . .
RUN apt-get update

WORKDIR frontend
RUN yarn
RUN yarn build
WORKDIR ..
RUN cp -R ./frontend/dist ./backend/static

# SETUP BACKEND
FROM python:3.8 as backend-build
WORKDIR /app
COPY --from=frontend-build /app/backend /app
COPY --from=frontend-build /app/frontend/dist /app/static
RUN pip install -r requirements.txt
CMD ["python3", "-m", "gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
