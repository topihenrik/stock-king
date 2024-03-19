# Database

To setup the database: 

### Linux

1. activate a virtual environment and install the requirements (if you've already activated the virtual env within backend folder, the script should work, in which case skip straight to step 2)
    ```
    python3 -m venv env
    env/bin/activate
    pip install -r requirements.txt
    ```

2. run the script and provide the environment for which you'd like to setup the database: either dev or test (pipeline is also a recognized environment as it needs a different user name)
    ```
    python3 init_database.py dev
    ```

### Windows

1. activate a virtual environment and install the requirements (if you've already activated the virtual env within backend folder, the script should work, in which case skip straight to step 2)
    ```
    python -m venv env
    env/Scripts/Activate
    pip install -r requirements.txt
    ```

2. run the script and provide the environment for which you'd like to setup the database: either dev or test (pipeline is also a recognized environment as it needs a different user name)
    ```
    python init_database.py dev
    ```

## Production

If changes are made to database and production database needs to be reinitialized, use the following commands

1. First open the proxy tunnel to fly's postgres service

    ```
    fly proxy 5433:5432 -a <postgres-app-name>
    ```

2. Execute the .sql file against the stocking database

    ```
    psql postgres://postgres:<password>@localhost:5433/stock_king -a -f init_tables.sql
    ```
    
## Prerequisites

- Installation of Postgres