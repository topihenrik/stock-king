import { expect, afterEach } from 'vitest';
import {act, cleanup} from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";
import {http, HttpResponse} from "msw";
import {companies} from "./mock-data/companies.js";
import {setupServer} from "msw/node";

vi.mock("zustand");

expect.extend(matchers);

export const restHandlers = [
    http.post('http://localhost:5000/api/get_companies', () => {
        return HttpResponse.json(companies)
    }),
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterAll(() => server.close())

afterEach(() => {
    server.resetHandlers();
    cleanup();
});