import os
import psycopg2
from psycopg2 import Error, sql
from datetime import date
import yfinance as yahoo
from forex_python.converter import CurrencyRates
from dotenv import load_dotenv, find_dotenv
from random import sample
from flaskr import tickers, tickers_sorted
from flask import jsonify

TICKERS_EASY = tickers_sorted.TICKERS_EASY
TICKERS_MEDIUM = tickers_sorted.TICKERS_MEDIUM
TICKERS_HARD = tickers_sorted.TICKERS_HARD

def initial_data_update():
    load_dotenv(find_dotenv())
    env = os.getenv("ENV")
    if env == "dev":
        random_easy_tickers = sample(TICKERS_EASY, 50)
        string_easy_tickers = " ".join(random_easy_tickers)
        upsert_stock_data(get_stock_data(string_easy_tickers), "easy")

        random_medium_tickers = sample(TICKERS_MEDIUM, 30)
        string_medium_tickers = " ".join(random_medium_tickers)
        upsert_stock_data(get_stock_data(string_medium_tickers), "medium")

        random_hard_tickers = sample(TICKERS_HARD, 30)
        string_hard_tickers = " ".join(random_hard_tickers)
        upsert_stock_data(get_stock_data(string_hard_tickers), "hard")



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
                    "full_time_employees": ticker.info.get("fullTimeEmployees", "Employee count unavailable")
                }
            )
        except:
            print(f"Failed to get company data on {ticker.ticker}")
            continue


    return stock_data




def get_categories_from_database():
    """
    Returns an array of available categories of stocks in the database
    """
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            query = sql.SQL("SELECT DISTINCT sector FROM company")
            cursor.execute(query)
            categories = cursor.fetchall()
            categories = [category[0] for category in categories]
            return categories


def get_scores_from_database(count=50, countries=[], gamemode="normal"):
    """
    Returns an array of objects representing highscores in the database
    """
    # Construct SQL query

    query = sql.SQL("SELECT * FROM scores WHERE sid IS NOT NULL AND ({country} IS NULL OR country = ANY ({country})) AND ({gamemode} IS NULL OR gamemode = {gamemode}) ORDER BY score DESC, timestamp ASC LIMIT {limit}").format(
        country=sql.Placeholder(),
        gamemode=sql.Placeholder(),
        limit=sql.Placeholder()
    )
    if(len(countries) == 0):
        countries = None

    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, (countries,countries,gamemode,gamemode,count))
            leaderboard = cursor.fetchall()
            highscores = score_db_result_to_dict(leaderboard)
            return highscores


def get_stock_data(stocks):
    """
    Takes a space-separated string of tickers/symbols as the parameter
    and returns a list of objects containing the stock data needed in the DB
    used in database upserts
    """
    tickers = yahoo.Tickers(stocks)
    stock_data = process_stock_data(tickers)

    return stock_data


def upsert_stock_data(data, difficulty):
    """
    Function for upserting stock data into the "company" table in the database.
    """
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            for row in data:
                # Construct SQL query
                query = sql.SQL(
                    """
                    INSERT INTO Company (ticker, name, difficulty, market_cap, currency, date, sector, website, full_time_employees)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (ticker) DO UPDATE
                    SET market_cap = EXCLUDED.market_cap,
                        date = EXCLUDED.date,
                        currency = EXCLUDED.currency,
                        website = EXCLUDED.website,
                        full_time_employees = EXCLUDED.full_time_employees;
                """
                )
                # Execute the query
                cursor.execute(
                    query,
                    (
                        row["ticker"],
                        row["name"],
                        difficulty,
                        row["market_cap"],
                        row["currency"],
                        row["date"],
                        row["sector"],
                        row["website"],
                        row["full_time_employees"],
                    ),
                )

            conn.commit()


def insert_scores(data):
    """
    Function to insert a new high score into the "score" table in the database.
    Takes a list of dicts representing highscores, adds all to database
    """
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            for row in data:
                # Construct SQL query
                query = sql.SQL(
                    """
                    INSERT INTO Scores
                    VALUES (default,%s, %s, %s, %s, NOW())
                    """
                )
                # Execute the query
                cursor.execute(
                    query,
                    (row["name"], row["score"], row["country"], row["gamemode"]),
                )
        conn.commit()

def get_database_currencies():
    """
    Function to get all currencies from the database.
    """
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT currency FROM Company;")
            currencies = cursor.fetchall()
            currencies = [currency[0].upper() for currency in currencies]
    return currencies


def process_currency_data(rates):
    current_date = date.today()
    rate_data = []
    for rate in rates:
        try:
            rate_data.append(
                {
                    "currency": str(rate.info["shortName"]).split("/")[0],
                    "ratio": rate.info["previousClose"],
                    "date": current_date,
                }
            )
        except:
            print(f"Failed to get exchange rate data")
            continue
    return rate_data


def get_exchange_rates_from_api():
    """
    Function for getting exchange rates from Yahoo! Finance API.
    """
    existing_currencies = [currency+"USD=X" for currency in add_all_currencies() if currency != "USD"]
    rates = []
    for currency in existing_currencies:
        rates.append(yahoo.Ticker(currency))
    processed_currencies = process_currency_data(rates)

    return processed_currencies


def add_all_currencies():
    existing_currencies = get_database_currencies()
    all_currencies = existing_currencies
    new_currencies = ["RUB", "GBP", "EUR", "AUD", "SGD"]
    for currency in new_currencies:
        if currency not in all_currencies:
            all_currencies.append(currency)        
    return all_currencies
   
def upsert_exchange_rates(data, enable = True):
    """
    Function for upserting exchange rates into the "exchange_rate" table in the database.
    """
    if enable:
        current_date = date.today()
        with connect_to_db() as conn:
            with conn.cursor() as cursor:
                for row in data:
                    currency = list(row.values())[0]
                    rate = list(row.values())[1]
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


def get_companies_from_database(
    difficulties=["easy"], exclude_tickers=[], wanted_categories=[], count=10
):
    """
    Takes a comma-separated string of tickers (Eg. "AAPL,MSFT,KNE") and an integer of how many companies to return
    Connects to database and returns a dictionary containing all company data from 10 companies that don't have one of the excluded tickers

    Function for getting companies from database

    Params:
            difficulties:       The difficulties that want to be included in the query
                                (array of difficulty values)
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
    #Construct SQL Query
    
    query = sql.SQL("SELECT * FROM company WHERE cid IS NOT NULL AND ({difficulty} IS NULL OR difficulty::text = ANY ({difficulty})) AND ({wanted_categories} IS NULL OR sector = ANY ({wanted_categories})) AND ({exclude_tickers} IS NULL OR ticker <> ALL ({exclude_tickers})) ORDER BY RANDOM()  LIMIT {limit}").format(
        difficulty=sql.Placeholder(),
        wanted_categories=sql.Placeholder(),
        exclude_tickers=sql.Placeholder(),
        limit=sql.Placeholder()
    )
    if(len(difficulties) == 0):
        difficulties = None
    if(len(wanted_categories) == 0):
        wanted_categories = None
    if(len(exclude_tickers) == 0):
        exclude_tickers = None

    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, (difficulties,difficulties,wanted_categories,wanted_categories,exclude_tickers,exclude_tickers,count))
            print(cursor.query)
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
        dictionary["difficulty"] = company[3]
        dictionary["market_cap"] = company[4]
        dictionary["currency"] = company[5]
        dictionary["date"] = company[6]
        dictionary["sector"] = company[7]
        dictionary["website"] = company[8]
        dictionary["img_url"] = f"https://logo.clearbit.com/{company[8]}"
        dictionary["full_time_employees"] = company[9]

        list_of_dicts.append(dictionary)

    return list_of_dicts


def score_db_result_to_dict(score_data_from_db):
    """
    Takes a psycopg2 database result of score data (list of tuples) and turns it into a dictionary for easier use
    """
    list_of_dicts = []
    for highscore in score_data_from_db:
        dictionary = {}
        dictionary["name"] = highscore[1]
        dictionary["score"] = highscore[2]
        dictionary["gamemode"] = highscore[4]
        dictionary["timestamp"] = highscore[5]
        dictionary["country"] = highscore[3]
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

def get_currencies_from_database():
    """
    Returns a JSON array of all existing currencies in the database
    """
    with connect_to_db() as conn:
        with conn.cursor() as cursor:
            query = sql.SQL(
                "SELECT DISTINCT to_currency, from_currency FROM ExchangeRates"
            )
            cursor.execute(query)
            currencies = cursor.fetchall()
            currencies = [currency[0] for currency in currencies]
            currencies.append("USD")
            return jsonify(currencies)

def convert_marketcaps_currencies(companies, game_currency):
    """
    Takes a dictionary containing all game data on companies and a string representation of desired currency 
    Gets exchange rate from the database, follows two-step conversion--first converts market cap to USD and then to the desired currency
    Replaces company market cap with the desired currency
    Returns a list of tuples containing all game data on companies with updated market cap and currency information
    """
    exchange_rates = get_exchange_rates_from_database()
    converted_market_cap = 0
    for company in companies:
        reporting_currency = company.get("currency")
        if(reporting_currency != game_currency):
            
            market_cap_usd = round(company.get("market_cap") * get_exchange_rate(exchange_rates, reporting_currency, "USD"))
            if(game_currency != "USD"):
                converted_market_cap = round(market_cap_usd * get_exchange_rate(exchange_rates, "USD", game_currency))
            else:
                converted_market_cap = market_cap_usd
            company.update({"market_cap": converted_market_cap})
            company.update({"currency":game_currency})
    return companies
def get_exchange_rate(exchange_rates, from_currency, to_currency):
    
    for exchange_rate in exchange_rates:
        if exchange_rate["from_currency"] == from_currency and exchange_rate["to_currency"] == to_currency:
             return exchange_rate["ratio"]
        elif exchange_rate["to_currency"] == from_currency and exchange_rate["from_currency"] == to_currency:
            return 1/exchange_rate["ratio"]
    return None

