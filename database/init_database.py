import psycopg2
from psycopg2 import sql
import sys
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

if len(sys.argv) < 2:
    print("Usage: python3 init_database.py [dev/test/pipeline]")
    sys.exit(1)

# Database Configuration
if sys.argv[1] == "dev":
    DB_NAME = "StocKing"
    DB_USER = "stocking"
    DB_PASSWORD = ""
elif sys.argv[1] == "test":
    DB_NAME = "StocKingTest"
    DB_USER = "stockingtest"
    DB_PASSWORD = ""
elif sys.argv[1] == "pipeline":
    DB_NAME = "stockingtest"
    DB_USER = "runner"
    DB_PASSWORD = "postgres"
else:
    print(
        "Invalid environment provided, please provide one of the following: dev, test, pipeline"
    )


def initialize_database():
    # Connection parameters
    connection_params = {
        "dbname": "postgres",
        "user": "postgres",
        "password": "",
        "host": "localhost",
        "port": "5432",
    }

    # Create a connection to PostgreSQL
    connection = psycopg2.connect(**connection_params)
    connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

    # Create a cursor to execute SQL commands
    cursor = connection.cursor()

    cursor.execute(
        sql.SQL("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s;"), (DB_NAME,)
    )
    exists = cursor.fetchone()
    if exists:
        print("Skipped database and role creation, already exists")

    if not exists:
        # Execute SQL commands from the file
        cursor.execute(sql.SQL("CREATE USER %s with password 'password';" % DB_USER))
        cursor.execute(sql.SQL("CREATE DATABASE %s owner %s;" % (DB_NAME, DB_USER)))
        print("Database and roles created successfully!")

    # Commit changes and close the connection
    cursor.close()
    connection.close()


def initialize_tables():

    # Read SQL queries from the file
    with open("init_tables.sql", "r") as sql_file:
        init_tables = sql_file.read()

    connection_params = {
        "dbname": DB_NAME,
        "user": DB_USER,
        "password": DB_PASSWORD,
        "host": "localhost",
        "port": "5432",
    }

    connection = psycopg2.connect(**connection_params)
    cursor = connection.cursor()

    cursor.execute(init_tables)

    connection.commit()
    connection.close()
    print("Tables created successfully!")


if sys.argv[1] != "pipeline":
    initialize_database()
initialize_tables()
