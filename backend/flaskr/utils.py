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
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            database=os.getenv("DB_DATABASE"),
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

def get_more_companies(excludedTickers, num_companies):
    """
    Takes a comma-separated string of tickers (Eg. "AAPL,MSFT,KNE") and an integer of how many companies to return
    Connects to database and returns a dictionary containing all company data from 10 companies that don't have one of the excluded tickers 
    """
    query = "SELECT * FROM company WHERE NOT ticker = ANY(%s) LIMIT %s;"
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, (excludedTickers,num_companies,))
            db_result = cursor.fetchall()
            cursor.close()
    return company_db_result_to_dict(db_result)

def company_db_result_to_dict(list_of_companies):
    """
    Takes a psycopg2 database result of company data (list of tuples) and turns it into a dictionary for easier use
    """
    list_of_dicts = []
    for company in list_of_companies:
        dictionary = {}
        dictionary["cid"] = company[0]
        dictionary["ticker"] = company[1]
        dictionary["name"] = company[2]
        dictionary["market_cap"] = company[3]
        dictionary["currency"] = company[4]
        dictionary["date"] = company[5]
        dictionary["sector"] = company[6]
        list_of_dicts.append(dictionary)
    return list_of_dicts

def get_exchange_rates_from_database():
    """
    Connects to database and returns a list of tuples representing the exchange rates in the database. 
    """
    query = "SELECT * FROM exchangerates;"
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query)
            exchange_rates = cursor.fetchall()
            cursor.close()
    return exchange_rate_db_result_to_dict(exchange_rates)

def exchange_rate_db_result_to_dict(list_of_exchange_rates):
    """
    Takes a psycopg2 database result of exchange rate data (list of tuples) and turns it into a dictionary for easier use
    """
    list_of_dicts = []
    for exchange_rate in list_of_exchange_rates:
        dictionary = {}
        dictionary["from_currency"] = exchange_rate[0]
        dictionary["to_currency"] = exchange_rate[1]
        dictionary["ratio"] = exchange_rate[2]
        dictionary["date"] = exchange_rate[3]
        list_of_dicts.append(dictionary)
    return list_of_dicts
        
def convertCompanyDataToCurrency(companies,game_currency):
    """
    Takes a dictionary containing all game data on companies and a string representation of desired currency eg. 'EUR' or 'USD'
    Gets exchange rate data from database and replaces the market cap into the desired currency
    Returns a list of tuples containing all game data on companies with updated market cap and currency information
    """
    exchange_rates = get_exchange_rates_from_database()
    for company in companies:
        reporting_currency = company.get('currency')
        if(reporting_currency != game_currency):
            for exchange_rate in exchange_rates:
                """
                If from_currency is the same currency as the company's reporting currency, multiply their market cap by the ratio 
                """
                if(exchange_rate.get('from_currency') == reporting_currency and exchange_rate.get('to_currency') == game_currency):
                    converted_market_cap = round(company.get("market_cap")*(exchange_rate.get("ratio")))
                    company.update({"market_cap":converted_market_cap})
                    break
                """
                If to_currency is the same currency as the company's reporting currency, divide their market cap by the ratio 
                """
                if(exchange_rate.get('to_currency') == reporting_currency and exchange_rate.get('from_currency') == game_currency):
                    converted_market_cap = round(company.get("market_cap")/(exchange_rate.get("ratio")))
                    company.update({"market_cap":converted_market_cap})
                    break
    return companies
