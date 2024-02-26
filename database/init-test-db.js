const { Client } = require('pg');

const initTestDB = async () => {
    const pgclient = new Client({
        host: 'localhost',
        port: '5432',
        user: 'runner',
        password: 'postgres',
        database: 'StocKingTest'
    });

    await pgclient.connect();

    const dropExchangeRatesIfExists = 'DROP TABLE IF EXISTS ExchangeRates CASCADE;';
    const createExchangeRates = 'CREATE TABLE ExchangeRates(from_currency TEXT NOT NULL, to_currency TEXT NOT NULL, ratio FLOAT NOT NULL, date DATE NOT NULL, PRIMARY KEY (to_currency, from_currency));';
    const dropCompanyIfExist = 'DROP TABLE IF EXISTS Company CASCADE;';
    const createCompany = 'CREATE TABLE Company(cid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, ticker TEXT UNIQUE NOT NULL, name TEXT NOT NULL, market_cap BIGINT NOT NULL, currency TEXT NOT NULL, date DATE NOT NULL, sector TEXT NOT NULL, website TEXT);';

    await pgclient.query(dropExchangeRatesIfExists);
    await pgclient.query(createExchangeRates);
    await pgclient.query(dropCompanyIfExist);
    await pgclient.query(createCompany);

    console.log('✅ Successfully initiated test database!')

    process.exit();
}

initTestDB()