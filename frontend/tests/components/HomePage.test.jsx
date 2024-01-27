import { describe, it, expect } from 'vitest';
import HomePage from "../../src/components/HomePage.jsx";
import {renderWithProvider} from "../test-utils.jsx";

describe('Basic tests', () => {
    it("Should just work", () => {
        expect(1).toBe(1);
    });

    it('Should have Hello World text', () => {
        const {getByText} = renderWithProvider(<HomePage/>);
        expect(getByText('Hello World!')).toBeTruthy();
    })
})
