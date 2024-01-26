FROM python:3.8
WORKDIR /usr/src/app
COPY . .

# SETUP BACKEND
RUN apt-get update
WORKDIR backend
RUN pip install -r requirements.txt
CMD ["python3", "-m", "gunicorn", "--bind", "0.0.0.0:8080", "app:app"]

