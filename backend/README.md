# Backend

## Environment requirements

    python 3.8

Setup the databases based on the instructions in the `README.md` file located in the `/database` folder.

## Environment variables

`.env`
```
ENV=dev
```

`.env.dev`
```
DB_USER="stocking"
DB_PASSWORD=""
DB_HOST="localhost"
DB_PORT="5432"
DB_DATABASE="StocKing"
```

`.env.test`
```
DB_USER="stockingtest"
DB_PASSWORD=""
DB_HOST="localhost"
DB_PORT="5432"
DB_DATABASE="StocKingTest"
```
## Windows

Setup virtual environment

    python -m venv env

Activate virtual environment

    env/Scripts/Activate.ps1

Install packages

    pip install -r requirements.txt

## Linux

Setup virtual environment

    python3 -m venv env

Activate virtual environment

    . env/bin/activate

Install packages

    pip install -r requirements.txt


## Start dev server

Inside ``flaskr/`` folder

    flask run

## Run tests

Inside ``backend`` folder

Linux

    python3 -m pytest

Windows

    python -m pytest