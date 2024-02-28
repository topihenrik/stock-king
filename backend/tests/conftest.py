import os
import pytest
from flaskr import app
from flaskr import utils as uts
from datetime import date
from dotenv import load_dotenv

os.environ["ENV"] = "test"

env = os.getenv("ENV")
load_dotenv(f".env.{env}")


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
            "website": "https://www.apple.com/"
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
            "website": "https://www.apple.com/"
        },
        {
            "ticker": "GOOGL",
            "name": "Alphabet Inc.",
            "market_cap": 456,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://abc.xyz/"
        },
        {
            "ticker": "MSFT",
            "name": "Microsoft Corporation",
            "market_cap": 789,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://www.microsoft.com/"
        },
        {
            "ticker": "AMZN",
            "name": "Amazon.com Inc.",
            "market_cap": 1011,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Retail",
            "website": "https://www.amazon.com/"
        },
        {
            "ticker": "TSLA",
            "name": "Tesla Inc.",
            "market_cap": 567,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Automotive",
            "website": "https://www.tesla.com/"
        },
        {
            "ticker": "FB",
            "name": "Meta Platforms, Inc.",
            "market_cap": 234,
            "currency": "USD",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://www.meta.com/"
        },
        {
            "ticker": "JPM",
            "name": "JPMorgan Chase & Co.",
            "market_cap": 345,
            "currency": "EUR",
            "date": date(2024, 2, 15),
            "sector": "Finance",
            "website": "https://www.jpmorganchase.com/"
        },
        {
            "ticker": "V",
            "name": "Visa Inc.",
            "market_cap": 678,
            "currency": "EUR",
            "date": date(2024, 2, 15),
            "sector": "Finance",
            "website": "https://www.visa.com/"
        },
        {
            "ticker": "DIS",
            "name": "The Walt Disney Company",
            "market_cap": 890,
            "currency": "EUR",
            "date": date(2024, 2, 15),
            "sector": "Entertainment",
            "website": "https://www.disney.com/"
        },
        {
            "ticker": "IBM",
            "name": "International Business Machines Corporation",
            "market_cap": 1234,
            "currency": "EUR",
            "date": date(2024, 2, 15),
            "sector": "Technology",
            "website": "https://www.ibm.com/"
        }
        ]


    return tickers_data


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
            "website": "https://www.appleapple.com/"
        }
    ]

    return tickers_data


@pytest.fixture()
def mock_exchangerates_initial():
    return [{"EUR": 0.9372071227741331}]


@pytest.fixture()
def mock_exchangerates_updated():
    return [{"EUR": 1}]
