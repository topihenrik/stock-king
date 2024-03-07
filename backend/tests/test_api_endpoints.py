import pytest

@pytest.fixture(autouse=True)
def run_before_testing(utils, mock_test_database_tickers, mock_exchangerates_initial):
    """
    Upsert the mock data before each test 
    """
    utils.upsert_stock_data(mock_test_database_tickers)
    utils.upsert_exchange_rates(mock_exchangerates_initial)
    
    yield

def test_get_companies_empty_body(client):
    """
    Test calling get_companies endpoint with empty body.
    """
    response = client.post("/api/get_companies", json={})

    assert response.json != []
    assert len(response.json) == 10
    for company in response.json:
        assert company["currency"] == "USD"


def test_get_companies(client):
    """
    Test to filter out results by ticker name and sector, converting currency from "EUR" to "EUR" (no convertion)
    """
    response = client.post("/api/get_companies", json= 
        {
            "excluded_tickers": ["MSFT","AAPL"],
            "currency":"EUR",
            "wanted_categories":["Finance"]
        }
    )
    
    assert response.json != []
    assert len(response.json) == 2
    for company in response.json:
        assert company["currency"] == "EUR"
        assert company["sector"] == "Finance"
        assert company["ticker"] not in ["MSFT", "AAPL"]


def test_get_companies_one_company(client):
    """
    Test getting one company with original currency "EUR" converted to "USD"
    """
    response = client.post("/api/get_companies", json= 
        {
            "excluded_tickers": ["DIS", "V", "JPM", "FB", "TSLA", "AMZN", "MSFT", "GOOGL", "AAPL"],
            "currency":"USD"
        }
    )
    
    assert response.json != []
    assert len(response.json) == 1
    for company in response.json:
        assert company["currency"] == "USD"
        assert company["ticker"] == "IBM"
        assert company["market_cap"] == 1317

def test_get_categories(client):
    """
    Test to get a list of unique categories for all companies in database. Each category should appear only once.
    """
    response = client.get("/api/get_categories")
    assert len(response.json) == 5
    for category in response.json:
            assert category in ["Technology","Retail","Automotive","Finance","Entertainment"]