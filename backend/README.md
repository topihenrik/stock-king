# Backend

## Environment requirements

    python 3.8

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