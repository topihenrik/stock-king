from flask import Flask, render_template, jsonify, send_from_directory
from flask_cors import CORS
from flaskr import utils
from flaskr import tickers
import yfinance as yahoo
from forex_python.converter import CurrencyRates
import random
import os
import pandas as pd
from datetime import date
from psycopg2 import sql

TICKERS = tickers.TICKERS

app = Flask(__name__, static_folder="static", template_folder="static")
CORS(app, resources={r"/*": {"origins": ["*"]}})


@app.route("/api")
def hello_world():
    return f"<p>{utils.hello_world()}</p>"


@app.route("/api/lorem_ipsum")
def lorem_ipsum():
    return jsonify(utils.lorem_ipsum())


@app.post("/api/test")
def test_function():
    return True


# Simple endpoint to receive the market cap of a random company from the server
# @app.route('/api/randomCompany')
# def getMarketCapFromRandomCompany():
#     companyData = random.choice(list(stock_data.values()))
#     return str(companyData)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>", methods=["GET"])
def catch_all(path):
    if os.environ.get("ENV") != None and os.environ.get("ENV") == "prod":
        if path != "" and os.path.exists(app.static_folder + "/" + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, "index.html")
    return ""


# TODO:This needs to be run daily to update stock data into database. Maybe it can be scheduled in fly.io via cron?
# Expensive method. Gets data from Yahoo Finance for all companies defined in TICKERS constant, then makes an update to database. Processes about 5 companies per second, so cannot be used in real-time.
def updateStockDataToDB():
    tickers = yahoo.Tickers(TICKERS)
    for ticker in tickers.tickers.values():
        try:
            # <DATABASE QUERY HERE>
            # db.query('INSERT INTO TICKERS VALUES ("'+ticker.info["symbol"]+'","'+ticker.info["marketCap"]+'")')
            print()
        except KeyError:
            continue
    return


# This needs to be called before the game can start. We might want to split it into multiple smaller calls to database to make it scalable since asking for all data from database everytime anyone opens the game seems dumb.
def loadStockDataFromDB():
    # <DATABASE QUERY HERE>
    # gameData = db.query('SELECT * FROM TICKERS')
    # sendToFrontend
    return


def get_stock_data():
    current_date = date.today()
    stock_data = []
    tickers = yahoo.Tickers("GOOGL AMD AAPL")

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


def upsert_stock_data():
    """
    Function for upserting stock data into the "company" table in the database.
    """
    data = get_stock_data()
    with utils.connect_to_db() as conn:
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
    with utils.connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT currency FROM Company;")
            currencies = cursor.fetchall()
            currencies = [currency[0] for currency in currencies]
    return currencies


def get_exchange_rates_from_api():
    """
    Function for getting exchange rates from Forex API.
    """
    existing_currencies = get_currencies_from_database()
    c = CurrencyRates()
    rates = c.get_rates("USD")
    needed_currency_rates = [
        {currency: rates[currency]}
        for currency in existing_currencies
        if currency != "USD"
    ]
    return needed_currency_rates


def upsert_exchange_rates():
    """
    Function for upserting exchange rates into the "exchange_rate" table in the database.
    """
    current_date = date.today()
    data = get_exchange_rates_from_api()
    with utils.connect_to_db() as conn:
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
