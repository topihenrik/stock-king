import {describe, it, expect} from "vitest";
import {act, render} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import GamePage from "../../src/components/GamePage.jsx";

describe('GamePage', () => {
    it('Should create panels', () => {
        const {getAllByTestId} = render(<BrowserRouter><GamePage /></BrowserRouter>);
        expect(getAllByTestId('panel')).toBeTruthy();
    });

    it('Should show correct high score', () => {
        const {getByTestId} = render(<BrowserRouter><GamePage highScore={16}/></BrowserRouter>);
        const element = getByTestId('text-highscore');
        expect(element).toHaveTextContent('High Score: 16');
    });

    it('Should update score properly', async () => {
        // TODO: Rewrite this once the API mocking library has been selected
        const {getAllByTestId} = render(<BrowserRouter><GamePage /></BrowserRouter>);
        const panels = getAllByTestId("panel");
        const scoreText = getAllByTestId("text-score")[0];
        act(() => {
            panels[0].click()
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
        const result = (scoreText.textContent == '0' || scoreText.textContent == '1');
        expect(result).toBe(true);
    });
})