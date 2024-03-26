import pytest


@pytest.fixture(autouse=True)
def run_before_testing(utils, mock_test_database_tickers, mock_exchangerates_initial):
    """
    Upsert the mock data before each test
    """
    utils.upsert_stock_data(mock_test_database_tickers, "easy")
    utils.upsert_exchange_rates(mock_exchangerates_initial, True)

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
    response = client.post(
        "/api/get_companies",
        json={
            "excluded_tickers": ["MSFT", "AAPL"],
            "currency": "EUR",
            "wanted_categories": ["Finance"],
        },
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
    response = client.post(
        "/api/get_companies",
        json={
            "excluded_tickers": [
                "DIS",
                "V",
                "JPM",
                "FB",
                "TSLA",
                "AMZN",
                "MSFT",
                "GOOGL",
                "AAPL",
            ],
            "currency": "USD",
        },
    )

    assert response.json != []
    assert len(response.json) == 1
    for company in response.json:
        assert company["currency"] == "USD"
        assert company["ticker"] == "IBM"
        assert company["market_cap"] == 1317


def test_get_companies_no_body(client):
    response = client.post("/api/get_companies")

    assert response.json != []
    assert len(response.json) == 10
    for company in response.json:
        assert company["currency"] == "USD"


def test_get_companies_count(client):
    response = client.post("/api/get_companies", json={"count": 5})

    assert len(response.json) == 5


def test_get_companies_with_other_content_type(client):
    response = client.post(
        "/api/get_companies",
        headers={"content-type": "application/x-www-form-urlencoded"},
    )
    print(response.json)
    assert (
        response.json["msg"]
        == "Please encode your request as application/json or send one without a body and content-type header"
    )


def test_get_categories(client):
    """
    Test to get a list of unique categories for all companies in database. Each category should appear only once.
    """
    response = client.get("/api/get_categories")
    assert len(response.json) == 5
    for category in response.json:
        assert category in [
            "Technology",
            "Retail",
            "Automotive",
            "Finance",
            "Entertainment",
        ]


def test_get_all_currencies(client):
    """
    Test the get_all_currencies API
    """
    response = client.get("/api/get_all_currencies")
    assert response.status_code == 200
    data = response.json
    assert data
    for currency in data:
        assert currency in ["EUR", "USD", "PHP", "SEK", "NOK"]


def test_insert_score(client):
    """
    Test inserting a new highscore to the database
    """
    response = client.post(
        "/api/new_high_score",
        json={
            "name": "Testuppimakkara",
            "score": 200,
            "country": "SOVEREIGN_NATION_OF_TESTOPIA",
            "count": 1,
        },
    )
    assert response.status_code == 200

    response = client.post(
        "/api/get_scores",
        json={"countries": ["SOVEREIGN_NATION_OF_TESTOPIA"], "count": 1},
    )
    assert response.json != []
    assert len(response.json) <= 1
    for index, highscore in enumerate(response.json):
        assert highscore["gamemode"] == "normal"
        assert highscore["country"] == "SOVEREIGN_NATION_OF_TESTOPIA"
        assert highscore["score"] == 200


def test_get_scores(utils, client, mock_scores_initial):
    """
    Test to get a list of highscores saved in the database.
    """

    utils.insert_scores(mock_scores_initial)

    response = client.post(
        "/api/get_scores",
        json={"countries": ["FIN", "SWE"]},
    )
    assert response.json != []
    assert len(response.json) <= 50
    for index, highscore in enumerate(response.json):
        assert highscore["gamemode"] == "normal"
        assert highscore["country"] in ["FIN", "SWE"]
        if index > 0:
            assert response.json[index]["score"] <= response.json[index - 1]["score"]

    response = client.post(
        "/api/get_scores",
        json={},
    )
    assert response.json != []
    assert len(response.json) <= 50
    for index, highscore in enumerate(response.json):
        assert highscore["gamemode"] == "normal"
        assert highscore["country"] in [
            "FIN",
            "SWE",
            "USA",
            "",
            "SOVEREIGN_NATION_OF_TESTOPIA",
        ]
        if index > 0:
            assert response.json[index]["score"] <= response.json[index - 1]["score"]

    response = client.post(
        "/api/get_scores",
        json={
            "gamemode": "timed",
        },
    )
    assert response.json == []
    assert len(response.json) <= 0

    response = client.post(
        "/api/get_scores",
        json={
            "count": 25,
            "gamemode": "normal",
        },
    )
    assert response.json != []
    assert len(response.json) <= 25
    for index, highscore in enumerate(response.json):
        assert highscore["gamemode"] == "normal"
        if index > 0:
            assert response.json[index]["score"] <= response.json[index - 1]["score"]
