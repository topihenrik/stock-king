import os
import psycopg2
from psycopg2 import Error, sql
from datetime import date
import yfinance as yahoo
from forex_python.converter import CurrencyRates
from dotenv import load_dotenv, find_dotenv
from random import sample
from flaskr import tickers

TICKERS = tickers.TICKERS


def initial_data_update():
    random_tickers = sample(TICKERS, 30)
    string_tickers = " ".join(random_tickers)
    upsert_stock_data(get_stock_data(string_tickers))


def clear_companies():
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("TRUNCATE Company;")


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
    load_dotenv(find_dotenv())
    env = os.getenv("ENV")
    load_dotenv(f".env.{env}")
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
                    "currency": ticker.info["currency"],
                    "date": current_date,
                    "sector": ticker.info["sector"],
                    "website": ticker.info["website"],
                }
            )
        except:
            print(f"Failed to get company data on {ticker.ticker}")
            continue

    return stock_data


def get_category_data():
    """
    Returns an array of available categories of stocks in the database
    """
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            query = sql.SQL('SELECT DISTINCT sector FROM company')
            cursor.execute(query)
            categories = cursor.fetchall()
            categories = [category[0] for category in categories]
            return categories

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
                    INSERT INTO Company (ticker, name, market_cap, currency, date, sector, website)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (ticker) DO UPDATE
                    SET market_cap = EXCLUDED.market_cap,
                        date = EXCLUDED.date,
                        currency = EXCLUDED.currency,
                        website = EXCLUDED.website;
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
                        row["website"],
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


def get_companies_from_database(exclude_tickers=[], wanted_categories=[], count=10):
    """
    Takes a comma-separated string of tickers (Eg. "AAPL,MSFT,KNE") and an integer of how many companies to return
    Connects to database and returns a dictionary containing all company data from 10 companies that don't have one of the excluded tickers

    Function for getting companies from database

    Params:
            exclude_tickers:    Companies that needs to be excluded from search
                                (array of ticker values)
            wanted_categories:   Companies that needs to appear in search.
                                If only these companies are needed, set the count to be exactly the amount of items in this array.
                                (array of ticker values)
            count:              How many companies are needed
                                (int)
    Returns:
            Array of dictionaries of company data
    """

    # Construct SQL query
    query_string = f"SELECT * FROM Company"

    if len(exclude_tickers) != 0:
        query_string += f" WHERE ticker NOT IN ("
        for ticker in exclude_tickers:
            if exclude_tickers[-1] == ticker:
                query_string += f"'{ticker}'"
            else:
                query_string += f"'{ticker}',"

        query_string += ")"

    if len(exclude_tickers) != 0 and len(wanted_categories) != 0:
        query_string += f" AND sector IN ("
        for sector in wanted_categories:
            if wanted_categories[-1] == sector:
                query_string += f"'{sector}'"
            else:
                query_string += f"'{sector}',"

        query_string += ")"

    if len(exclude_tickers) == 0 and len(wanted_categories) != 0:
        query_string += f" WHERE sector IN ("
        for sector in wanted_categories:
            if wanted_categories[-1] == sector:
                query_string += f"'{sector}'"
            else:
                query_string += f"'{sector}',"

        query_string += ")"

    query_string += f" ORDER BY RANDOM() LIMIT {count};"

    query = sql.SQL(query_string)

    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query)

            db_result = cursor.fetchall()

    list_of_company_dicts = company_db_result_to_dict(db_result)

    return list_of_company_dicts


def company_db_result_to_dict(company_data_from_db):
    """
    Takes a psycopg2 database result of company data (list of tuples) and turns it into a dictionary for easier use
    """
    list_of_dicts = []
    for company in company_data_from_db:
        dictionary = {}
        dictionary["ticker"] = company[1]
        dictionary["name"] = company[2]
        dictionary["market_cap"] = company[3]
        dictionary["currency"] = company[4]
        dictionary["date"] = company[5]
        dictionary["sector"] = company[6]
        dictionary["website"] = company[7]
        dictionary["img_url"] = f"https://logo.clearbit.com/{company[7]}"
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

    list_of_currency_dicts = exchange_rate_db_result_to_dict(exchange_rates)

    return list_of_currency_dicts


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

        list_of_dicts.append(dictionary)

    return list_of_dicts


def convert_marketcaps_currencies(companies, game_currency):
    """
    Takes a dictionary containing all game data on companies and a string representation of desired currency eg. 'EUR' or 'USD'
    Gets exchange rate data from database and replaces the market cap into the desired currency
    Returns a list of tuples containing all game data on companies with updated market cap and currency information
    """
    exchange_rates = get_exchange_rates_from_database()
    for company in companies:
        reporting_currency = company.get("currency")
        if reporting_currency != game_currency:
            for exchange_rate in exchange_rates:

                # If from_currency is the same currency as the company's reporting currency, multiply their market cap by the ratio
                if (
                    exchange_rate.get("from_currency") == reporting_currency
                    and exchange_rate.get("to_currency") == game_currency
                ):
                    converted_market_cap = round(
                        company.get("market_cap") * (exchange_rate.get("ratio"))
                    )
                    company.update({"market_cap": converted_market_cap})
                    company.update({"currency": game_currency})
                    break

                # If to_currency is the same currency as the company's reporting currency, divide their market cap by the ratio
                if (
                    exchange_rate.get("to_currency") == reporting_currency
                    and exchange_rate.get("from_currency") == game_currency
                ):
                    converted_market_cap = round(
                        company.get("market_cap") / (exchange_rate.get("ratio"))
                    )
                    company.update({"market_cap": converted_market_cap})
                    company.update({"currency": game_currency})
                    break
    return companies

    def get_currency_data():
        """
        Returns a JSON array of all existing currencies in the database
        """
        with connect_to_db() as conn:
            with conn.cursor() as cursor:
                query = sql.SQL('SELECT DISTINCT to_currency, from_currency FROM ExchangeRates')
                cursor.execute(query)
                currencies = cursor.fetchall()
                currencies = [currency[0] for currency in currencies]
                return jsonify(currencies)

