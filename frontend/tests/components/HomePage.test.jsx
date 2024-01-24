import { describe, it, expect } from 'vitest';
import HomePage from "../../src/components/HomePage.jsx";
import {render} from "@testing-library/react";

describe('Basic tests', () => {
    it("Should run", () => {
        expect(1).toBe(1);
    });

    it('The Page should have Hello World text', () => {
        const {getByText} = render(<HomePage/>);

        expect(getByText('Hello World!')).toBeTruthy();
    })
})
