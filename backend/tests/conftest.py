import pytest
from flaskr import app
from flaskr import utils as uts
from datetime import date


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
        }
    ]

    return tickers_data


@pytest.fixture()
def mock_exchangerates_initial():
    return [{"EUR": 0.9372071227741331}]


@pytest.fixture()
def mock_exchangerates_updated():
    return [{"EUR": 1}]
