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

Set environment variables
    For dev:
        set "ENV=dev" & set "DB_USER=stocking" & set "DB_PASSWORD=" & set "DB_HOST=localhost" & set "DB_PORT=5432" & set "DB_DATABASE=StocKing"
    For test:
        set "ENV=dev" & set "DB_USER=stockingtest" & set "DB_PASSWORD=" & set "DB_HOST=localhost" & set "DB_PORT=5432" & set "DB_DATABASE=StocKingTest"

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

## Database queries

- For inserting timestamps and dates you can use the Postgres [built-in functions](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT).