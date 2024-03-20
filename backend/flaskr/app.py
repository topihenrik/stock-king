from flask import Flask, request, Response, render_template, jsonify, send_from_directory
#from flask_apscheduler import APScheduler
from flask_cors import CORS
from flaskr import utils, tickers
from dotenv import find_dotenv, load_dotenv
import os
import json


TICKERS = tickers.TICKERS

app = Flask(__name__, static_folder="static", template_folder="static")
CORS(app, resources={r"/*": {"origins": ["*"]}})

# Load env
load_dotenv(find_dotenv())
ENV = os.getenv("ENV")
load_dotenv(find_dotenv(f".env.{ENV}"))

# Initialize scheduler
#scheduler = APScheduler()

# set confuguration for the scheduler
#scheduler.api_enabled = False  # (default)
#scheduler.api_prefix = "/scheduler" # (default)
#scheduler.endpoint_prefix = "scheduler." # (default)
#scheduler.allowed_hosts = ["*"] # (default)
#scheduler.init_app(app)
#scheduler.start()

# Update stock data
# NOTICE: Company data should be updated with more sophisticated method in the future
if ENV != "test":
    utils.initial_data_update()


@app.post("/api/test")
def test_function():
    return True

  
@app.get("/api/get_categories")
def get_categories():
    """
    Endpoint for getting category data.
    No parameters required.

    Returns:
        Array of strings of category data in database.
        Example:
        ["Basic Materials","Communication Services","Consumer Cyclical","Consumer Defensive","Financial Services","Healthcare","Industrials","Real Estate","Technology","Utilities"]
    """
    categories = utils.get_categories_from_database()
    return categories


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
    if request.content_type != "application/json" and request.content_type is not None:
        return {
            "msg": "Please encode your request as application/json or send one without a body and content-type header"
        }

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

@app.post("/api/new_high_score")
def new_high_score():
    """
    Endpoint for adding a new leaderboard highscore.
    Required parameters:
    "name": string,
    "score": integer,
    Optional parameters:
    "country": string (ISO 3166-1 Alpha-3 format),
    "gamemode": predefined strings "normal" OR "timed" defaults to "normal"
    Returns: Empty response with status code indicating success or failure
    """

    # Get params from request body
    raw_data = request.data
    try:
        json_data = json.loads(raw_data)
    except Exception:
        return Response("Malformed request",status=400)
    if json_data.get("name") is None or json_data.get("score") is None:
        return Response("Malformed request",status=400)
    else:
        name = json_data.get("name")
        score = json_data.get("score")
        country = (json_data.get("country") if json_data.get("country") else "")
        gamemode = (json_data.get("gamemode") if json_data.get("gamemode") else "normal")

    new_high_score = {
        "name":name,
        "score":score,
        "country":country,
        "gamemode":gamemode
    }

    utils.insert_scores([new_high_score])
    return "success"

@app.post("/api/get_scores")
def get_scores():
    """
    Endpoint for getting leaderboard scores.
    No required parameters. 
    Pass an integer parameter 'count' to specify number of scores to get
    Pass an array of strings as 'country' (Using ISO 3166-1 Alpha-3 format) to specify which countries to get scores from.

    Returns:
        Array of JSON objects of scores in database.
        Example:
        [{
            'sid': '1', 
            'player_name': 'Ketsuppimakkara', 
            'score': 50, 
            'country':'FIN', 
            'timestamp':'2024-03-20 20:32:29.957037+02'
        },
        {
            'sid': '2', 
            'player_name': 'Sinappimakkara', 
            'score': 25, 
            'country':'SWE', 
            'timestamp':'2024-03-19 21:32:29.957037+02'
        }
        ]
    """

    # Get params from request body
    raw_data = request.data
    try:
        json_data = json.loads(raw_data)
    except Exception:
        json_data = {}

    countries = (
        json_data.get("countries") if json_data.get("countries") else []
    )
    gamemode = (
        json_data.get("gamemode") if json_data.get("gamemode") else "normal"
    )
    count = int(json_data.get("count") or 50)
    scores = utils.get_scores_from_database(count,countries,gamemode)
    return scores

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>", methods=["GET"])
def catch_all(path):
    if ENV != None and ENV == "prod":
        if path != "" and os.path.exists(app.static_folder + "/" + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, "index.html")
    return ""


@app.get("/api/get_all_currencies")
def get_all_currencies():
    """
    Endpoint for getting all existing currencies.
    No parameters required.

    Returns:
        Array of currency codes in JSON format
    """
    currencies = utils.get_currencies_from_database()
    return currencies


#@scheduler.task("cron", id="update_database", hour=4, minute=0)
#def update_database():
#    """
#    This function is run every day at 4:00.
#    Gets data from Yahoo Finance for all companies defined in TICKERS constant, 
#    then makes an update to database. Processes about 5 companies per second, so cannot be used in real-time.
#   """
#    print("Update of database started.")
#    try:
#        print("Updating market cap data.")
#        string_tickers = " ".join(TICKERS)
#        stock_data = utils.get_stock_data(string_tickers)
#        utils.upsert_stock_data(stock_data)
#    except Exception as err:
#        print(f"Failed to update market cap data. {type(err)}: {err}")
#    
#    try: 
#       print("Updating exchange rate data.")
#        exchange_rate_data = utils.get_exchange_rates_from_api()
#        utils.upsert_exchange_rates(exchange_rate_data)
#    except Exception as err:
#        print(f"Failed to update exchange rate data. {type(err)}: {err}")
