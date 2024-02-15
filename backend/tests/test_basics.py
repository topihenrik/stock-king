from datetime import date


def test_process_currency_data(utils):
    rates = ["USD", "EUR"]
    existing_currencies = {
        "EUR": 0.9372071227741331,
        "SEK": 10.880974695407685,
        "NOK": 11.131208997188379,
        "PHP": 56.08434864104967,
    }
    expected = [{"EUR": 0.9372071227741331}]

    assert utils.process_currency_data(rates, existing_currencies) == expected
