import { describe, it, expect } from 'vitest';
import TestPage from "../../src/components/TestPage.jsx";
import {renderWithProvider} from "../test-utils.jsx";

describe('Basic tests', () => {
    it("Should just work", () => {
        expect(1).toBe(1);
    });

    it('Should have Hello World text', () => {
        const {getByText} = renderWithProvider(<TestPage/>);
        expect(getByText('Hello World!')).toBeTruthy();
    })
})
