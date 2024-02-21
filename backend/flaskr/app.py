from flask import Flask, render_template, jsonify, send_from_directory
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
