import { expect, afterEach } from 'vitest';
import {act, cleanup} from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";
import {http, HttpResponse} from "msw";
import {companies} from "./mock-data/companies.js";
import {exchangeRates} from './mock-data/exchangeRates.js';
import {setupServer} from "msw/node";

vi.mock("zustand");

expect.extend(matchers);

export const restHandlers = [
    http.post('http://localhost:5000/api/get_companies', async ({ request }) => {
        const { excluded_tickers, wanted_categories, currency, count } = await request.json();

        // Construct the response based on the request parameters
        let response = companies.filter(company => !excluded_tickers.includes(company.ticker));
        
        if (!(wanted_categories.length === 0)) {
            response = response.filter(response => wanted_categories.includes(response.sector))
        }

        if (!(currency.length === 0)) {
            response.forEach(company => {
                if (!(company.currency === currency)) {
                    const exchangeRate = exchangeRates.find(rate => rate.from_currency === company.currency &&
                                                            rate.to_currency === currency);
                    if (exchangeRate) {
                        // Convert company market cap to the requested currency
                        company.market_cap = company.market_cap * exchangeRate.ratio;
                        company.currency = currency;
                    } else {
                        console.log("The exchange rate between", company.currency ,"and",
                                    currency, "hasn't been added in the mock data in exchangeRates.js");
                    }
                }
            });
        }

        response = response.slice(0, count);

        return HttpResponse.json(response)
    }),
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterAll(() => server.close())

afterEach(() => {
    server.resetHandlers();
    cleanup();
});