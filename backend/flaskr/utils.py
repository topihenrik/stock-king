import os
import psycopg2
from psycopg2 import Error, sql
import pandas as pd
from datetime import date
import yfinance as yahoo
from forex_python.converter import CurrencyRates
from dotenv import load_dotenv

env = os.getenv("ENV")
load_dotenv(f".env.{env}")


def lorem_ipsum():
    data = {
        "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lobortis condimentum arcu quis bibendum. Phasellus lacinia nisl non diam bibendum fringilla. Pellentesque quis justo tincidunt, lobortis elit a, egestas felis. Cras non eleifend sem. Donec non auctor mauris. Proin imperdiet nisi vel condimentum ultrices. Etiam non quam mi. In vel porta sapien. Nullam pulvinar id tellus nec sodales. Nunc faucibus a sapien ullamcorper lacinia. Aenean at porttitor orci. Donec ac massa id elit rutrum fringilla sed sed nunc. Ut dapibus dolor libero, eu mollis mi suscipit ut."
    }
    return data


def connect_to_db():
    """
    Function to connect to the database
    Returns: connection object

    Example of use:\n
    connection = utils.connect_to_db()\n
    cursor = connection.cursor()\n
    cursor.execute("SELECT * FROM table_name")\n
    cursor.fetchall()\n
    cursor.close()
    """
    try:
        connection = psycopg2.connect(
            user=os.getenv("DB_USER").replace('"',''),
            password=os.getenv("DB_PASSWORD").replace('"',''),
            host=os.getenv("DB_HOST").replace('"',''),
            port=int(os.getenv("DB_PORT").replace('"','')),
            database=os.getenv("DB_DATABASE").replace('"',''),
        )

        print("Connected to Database")
        return connection

    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return None


def process_stock_data(tickers):
    """
    Function to process stock data from the Yahoo Finance API
    """
    current_date = date.today()
    stock_data = []

    for ticker in tickers.tickers.values():
        try:
            stock_data.append(
                {
                    "ticker": ticker.info["symbol"],
                    "name": ticker.info["shortName"],
                    "market_cap": ticker.info["marketCap"],
                    "currency": ticker.info["financialCurrency"],
                    "date": current_date,
                    "sector": ticker.info["sector"],
                }
            )
        except KeyError:
            print("Failed to get market cap information on {}", ticker.ticker["symbol"])
            continue

    return stock_data


def get_stock_data(stocks):
    """
    Takes a space-separated string of tickers/symbols as the parameter
    and returns a list of objects containing the stock data needed in the DB
    used in database upserts
    """
    tickers = yahoo.Tickers(stocks)
    stock_data = process_stock_data(tickers)

    return stock_data


def upsert_stock_data(data):
    """
    Function for upserting stock data into the "company" table in the database.
    """
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            for row in data:
                # Construct SQL query
                query = sql.SQL(
                    """
                    INSERT INTO Company (ticker, name, market_cap, currency, date, sector)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (ticker) DO UPDATE
                    SET market_cap = EXCLUDED.market_cap,
                        date = EXCLUDED.date,
                        currency = EXCLUDED.currency;
                """
                )
                # Execute the query
                cursor.execute(
                    query,
                    (
                        row["ticker"],
                        row["name"],
                        row["market_cap"],
                        row["currency"],
                        row["date"],
                        row["sector"],
                    ),
                )

            conn.commit()


def get_currencies_from_database():
    """
    Function to get all currencies from the database.
    """
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT currency FROM Company;")
            currencies = cursor.fetchall()
            currencies = [currency[0] for currency in currencies]
    return currencies


def process_currency_data(existing_currencies, rates):
    needed_currency_rates = [
        {currency: rates[currency]}
        for currency in existing_currencies
        if currency != "USD"
    ]
    return needed_currency_rates


def get_exchange_rates_from_api():
    """
    Function for getting exchange rates from Forex API.
    """
    existing_currencies = get_currencies_from_database()
    c = CurrencyRates()
    rates = c.get_rates("USD")
    processed_currencies = process_currency_data(existing_currencies, rates)

    return processed_currencies


def upsert_exchange_rates(data):
    """
    Function for upserting exchange rates into the "exchange_rate" table in the database.
    """
    current_date = date.today()
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            for row in data:
                currency = list(row.keys())[0]
                # Revert the exchange rate to get the rate from the currency to USD
                rate = 1 / row[currency]
                # Construct SQL query
                query = sql.SQL(
                    """
                    INSERT INTO ExchangeRates (from_currency, to_currency, ratio, date)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (from_currency, to_currency) DO UPDATE
                    SET ratio = EXCLUDED.ratio;
                """
                )
                # Execute the query
                cursor.execute(query, (currency, "USD", rate, current_date))
            conn.commit()

def getCompanies(excludedTickers):
    query = "SELECT * FROM company WHERE NOT ticker = ANY(%s) LIMIT 10;"
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, (excludedTickers,))
            companies = cursor.fetchall()
            cursor.close()
            return companies