# Database

To setup the database:

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

## Prerequisites

- Installation of Postgres