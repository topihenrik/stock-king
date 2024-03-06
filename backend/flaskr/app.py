from flask import Flask, request, render_template, jsonify, send_from_directory
import json
from dotenv import find_dotenv, load_dotenv
from flask_cors import CORS
from flaskr import utils
from flaskr import tickers
import yfinance as yahoo
import random
import os

TICKERS = tickers.TICKERS

app = Flask(__name__, static_folder="static", template_folder="static")
CORS(app, resources={r"/*": {"origins": ["*"]}})

# Load env

load_dotenv(find_dotenv())
ENV = os.getenv("ENV")
load_dotenv(find_dotenv(f".env.{ENV}"))


# Update stock data
# NOTICE: Company data should be updated with more sophisticated method in the future
if ENV != "test":
    utils.initial_data_update()


@app.post("/api/test")
def test_function():
    return True


@app.post("/api/get_companies")
def get_companies():
    """
    Endpoint for getting company data.
    None of the params are required when making a request since we have default values for params.

    Request params in json format:
        excluded_tickers:   Array of tickers (string) that need to be excluded from the result.
                            Default: []
                            Example: ["APPL", "GOOGL"]

        wanted_categories:  Array of the only categories/sectors (string) that need be in the result.
                            Default: []
                            Example: ["machinery", "technology"]

        currency:           Currency code as string.
                            Default: "USD"
                            Example: "EUR"

        count:              How many companies need to be in the result (int).
                            Default: 10
                            Example: 1

    Returns:
        Array of dictionaries of company data.
        Example:
        [
            {
                "ticker" : AAPL
                "name" : Apple
                "market_cap" : 123123123
                "currency" : "USD"
                "date" : "Mon, 26 Feb 2024 00:00:00 GMT"
                "sector" : "technology"
                "website" : "https://www.apple.com"
                "img_url" : "https://logo.clearbit.com/https://www.apple.com"
            }
        ]
    """

    # Get params from request body
    raw_data = request.data
    try:
        json_data = json.loads(raw_data)
    except Exception:
        json_data = {}
    exclude_tickers = (
        json_data.get("excluded_tickers") if json_data.get("excluded_tickers") else []
    )
    wanted_categories = (
        json_data.get("wanted_categories") if json_data.get("wanted_categories") else []
    )
    count = int(json_data.get("count") or 10)
    currency = json_data.get("currency") if json_data.get("currency") else "USD"

    # Get company data from database
    companies = utils.get_companies_from_database(
        exclude_tickers, wanted_categories, count
    )
    companies = utils.convert_marketcaps_currencies(companies, currency)

    return companies


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>", methods=["GET"])
def catch_all(path):
    if ENV != None and ENV == "prod":
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
