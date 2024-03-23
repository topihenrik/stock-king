DROP TABLE IF EXISTS ExchangeRates CASCADE;
CREATE TABLE ExchangeRates(
    from_currency TEXT NOT NULL,
    to_currency TEXT NOT NULL,
    ratio FLOAT NOT NULL,
    date DATE NOT NULL,
    PRIMARY KEY (to_currency, from_currency)
);

DROP TABLE IF EXISTS Company CASCADE;
CREATE TABLE Company(
    cid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ticker TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    market_cap BIGINT NOT NULL,
    currency TEXT NOT NULL,
    date DATE NOT NULL,
    sector TEXT NOT NULL,
    website TEXT,
    full_time_employees TEXT,
    revenue_growth DECIMAL (5, 2),
    earnings_growth DECIMAL (5, 2)
);

DROP TABLE IF EXISTS Scores CASCADE;
CREATE TABLE Scores(
    sid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    player_name TEXT NOT NULL,
    score INT NOT NULL,
    country TEXT,
    gamemode TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);