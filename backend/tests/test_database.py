import pytest
import datetime


@pytest.fixture(autouse=True)
def run_before_testing(utils):
    

    with utils.connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM ExchangeRates;")
            cursor.execute("DELETE FROM Company;")
        conn.commit()

    yield


def test_upsert_stock_data_new_entry(utils, mock_tickers_initial):
    """
    Test that upserting a new company creates a new entry in the database
    """
    utils.upsert_stock_data(mock_tickers_initial, "easy")
    with utils.connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * from Company")
            result_data = cursor.fetchall()
            cursor.execute("SELECT COUNT(*) from Company")
            result_count = cursor.fetchone()

    cleaned_result = [
        (item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8])
        for item in result_data
    ]

    expected_data = [
        (
            "AAPL",
            "Apple Inc.",
            "easy",
            123,
            "USD",
            datetime.date(2024, 2, 15),
            "Technology",
            "https://www.apple.com/",
        )
    ]
    expected_count = (1,)

    assert expected_data == cleaned_result
    assert expected_count == result_count


def test_upsert_stock_data_updated_market_cap(utils, mock_tickers_updated):
    """
    Test that second upsert of the same company updates the market cap and date,
    and doesn't create a new entry
    """

    utils.upsert_stock_data(mock_tickers_updated, "hard")
    with utils.connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * from Company")
            result_data = cursor.fetchall()
            cursor.execute("SELECT COUNT(*) from Company")
            result_count = cursor.fetchone()

    cleaned_result = [
        (item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8])
        for item in result_data
    ]

    expected_data = [
        (
            "AAPL",
            "Apple Inc.",
            "hard",
            321,
            "USD",
            datetime.date(2024, 2, 16),
            "Technology",
            "https://www.appleapple.com/",
        )
    ]
    expected_count = (1,)

    assert expected_data == cleaned_result
    assert expected_count == result_count


def test_upsert_exchangerates_new_entry(utils, mock_exchangerates_initial):
    """
    Test that upserting a new company creates a new entry in the database
    """
    utils.upsert_exchange_rates(mock_exchangerates_initial, True)
    with utils.connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * from ExchangeRates")
            result_data = cursor.fetchall()
            cursor.execute("SELECT COUNT(*) from ExchangeRates")
            result_count = cursor.fetchone()

    cleaned_result = [(item[0], item[1], item[2]) for item in result_data]
    expected_data = [
        (
            "EUR",
            "USD",
            mock_exchangerates_initial[0]["ratio"],
        )
    ]
    expected_count = (1,)

    assert expected_data == cleaned_result
    assert expected_count == result_count


def test_upsert_exchangerates_updated_market_cap(utils, mock_exchangerates_updated):
    """
    Test that second upsert of the same company updates the market cap and date,
    and doesn't create a new entry
    """
    utils.upsert_exchange_rates(mock_exchangerates_updated, True)
    with utils.connect_to_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * from ExchangeRates")
            result_data = cursor.fetchall()
            cursor.execute("SELECT COUNT(*) from ExchangeRates")
            result_count = cursor.fetchone()

    cleaned_result = [(item[0], item[1], item[2]) for item in result_data]

    expected_data = [
        (
            "EUR",
            "USD",
            1,
        )
    ]
    expected_count = (1,)

    assert expected_data == cleaned_result
    assert expected_count == result_count
