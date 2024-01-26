# SETUP FRONTEND
FROM node:20 as frontend-build
WORKDIR /frontend
COPY /frontend /
RUN yarn
RUN yarn build

# PRODUCTION SERVER
FROM python:3.8 as production-server
WORKDIR /server
COPY /backend/requirements.txt /server
COPY /backend/flaskr /server/flaskr
COPY --from=frontend-build /dist /server/flaskr/static
RUN pip install -r requirements.txt

CMD ["python3", "-m", "gunicorn", "--chdir", "/server/flaskr", "--bind", "0.0.0.0:8080", "app:app"]
