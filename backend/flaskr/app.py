from flask import Flask, request, render_template, jsonify, send_from_directory
from flask_cors import CORS
from flaskr import utils
from flaskr import tickers
import yfinance as yahoo

import random
import os


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
    """
    
    # Get params from request body
    requestBody = request.get_json()
    exclude_tickers = requestBody.get("excluded_tickers") if requestBody.get("excluded_tickers") else []
    wanted_categories = requestBody.get("wanted_categories") if requestBody.get("wanted_categories") else []
    count = int(requestBody.get("count") or 10)
    currency = requestBody.get('currency') if requestBody.get("currency") else "USD"
    
    # Get company data from database
    companies = utils.get_companies_from_database(exclude_tickers, wanted_categories, count)
    companies = utils.convert_marketcaps_currencies(companies, currency)
    
    return companies


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
