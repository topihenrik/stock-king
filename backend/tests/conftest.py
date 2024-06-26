import os

os.environ["ENV"] = "test"
import pytest
from flaskr import app
from flaskr import utils as uts
from datetime import date
from dotenv import load_dotenv, find_dotenv

env = os.getenv("ENV")
load_dotenv(find_dotenv(f".env.{env}"))


@pytest.fixture()
def server():
    server = app.app
    server.config.update({"TESTING": True})

    yield server


@pytest.fixture()
def client(server):
    return server.test_client()


@pytest.fixture()
def runner(server):
    return server.test_cli_runner()


@pytest.fixture()
def utils():

    utils = uts

    return utils


@pytest.fixture()
def mock_tickers_initial():
    tickers_data = [
        {
            "ticker": "AAPL",
            "name": "Apple Inc.",
            "market_cap": 123,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://www.apple.com/",
            "full_time_employees": 123,
        }
    ]

    return tickers_data


@pytest.fixture()
def mock_test_database_tickers():
    tickers_data = [
        {
            "ticker": "AAPL",
            "name": "Apple Inc.",
            "market_cap": 123,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://www.apple.com/",
            "full_time_employees": 123,
        },
        {
            "ticker": "GOOGL",
            "name": "Alphabet Inc.",
            "market_cap": 456,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://abc.xyz/",
            "full_time_employees": 456,
        },
        {
            "ticker": "MSFT",
            "name": "Microsoft Corporation",
            "market_cap": 789,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://www.microsoft.com/",
            "full_time_employees": 789,
        },
        {
            "ticker": "AMZN",
            "name": "Amazon.com Inc.",
            "market_cap": 1011,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Retail",
            "website": "https://www.amazon.com/",
            "full_time_employees": 1011,
        },
        {
            "ticker": "TSLA",
            "name": "Tesla Inc.",
            "market_cap": 567,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Automotive",
            "website": "https://www.tesla.com/",
            "full_time_employees": 567,
        },
        {
            "ticker": "FB",
            "name": "Meta Platforms, Inc.",
            "market_cap": 234,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://www.meta.com/",
            "full_time_employees": 234,
        },
        {
            "ticker": "JPM",
            "name": "JPMorgan Chase & Co.",
            "market_cap": 345,
            "currency": "EUR",
            "date": date(2024, 2, 15),
            "sector": "Finance",
            "website": "https://www.jpmorganchase.com/",
            "full_time_employees": 345,
        },
        {
            "ticker": "V",
            "name": "Visa Inc.",
            "market_cap": 678,
            "currency": "EUR",
            "date": date(2024, 2, 15),
            "sector": "Finance",
            "website": "https://www.visa.com/",
            "full_time_employees": 678,
        },
        {
            "ticker": "DIS",
            "name": "The Walt Disney Company",
            "market_cap": 890,
            "currency": "EUR",
            "date": date(2024, 2, 15),
            "sector": "Entertainment",
            "website": "https://www.disney.com/",
            "full_time_employees": 890,
        },
        {
            "ticker": "IBM",
            "name": "International Business Machines Corporation",
            "market_cap": 1234,
            "currency": "EUR",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://www.ibm.com/",
            "full_time_employees": 1234,
        },
    ]

    return tickers_data


@pytest.fixture()
def mock_scores_initial():
    score_data = [
        {
            "country": "FIN",
            "gamemode": "normal",
            "name": "ketsuppimakkara",
            "score": 500,
            "timestamp": "Wed, 20 Mar 2024 18:32:29 GMT",
        },
        {
            "country": "FIN",
            "gamemode": "normal",
            "name": "sinappimakkara",
            "score": 500,
            "timestamp": "Wed, 20 Mar 2024 18:32:38 GMT",
        },
        {
            "country": "SWE",
            "gamemode": "normal",
            "name": "Velcromakkara",
            "score": 45,
            "timestamp": "Wed, 20 Mar 2024 18:36:47 GMT",
        },
        {
            "country": "USA",
            "gamemode": "normal",
            "name": "äyskärimaisteri420",
            "score": 40,
            "timestamp": "Wed, 20 Mar 2024 18:33:20 GMT",
        },
        {
            "country": "",
            "gamemode": "normal",
            "name": "burgerikeisari",
            "score": 20,
            "timestamp": "Wed, 20 Mar 2024 18:33:20 GMT",
        },
    ]
    return score_data


@pytest.fixture()
def mock_tickers_updated():
    tickers_data = [
        {
            "ticker": "AAPL",
            "name": "Apple Inc.",
            "market_cap": 321,
            "currency": "USD",
            "date": date(2024, 2, 16),
            "sector": "Technology",
            "website": "https://www.appleapple.com/",
            "full_time_employees": 321,
        }
    ]

    return tickers_data


@pytest.fixture()
def mock_exchangerates_initial():
    return [
        {
            "currency": "EUR",
            "ratio": 1.0669999999999999811141,
            "date": date(2023, 5, 20),
        }
    ]


@pytest.fixture()
def mock_exchangerates_updated():
    return [{"currency": "EUR", "ratio": 1, "date": date(2023, 5, 20)}]
