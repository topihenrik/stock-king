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
        const {getByTestId} = render(<BrowserRouter><GamePage/></BrowserRouter>);
        const element = getByTestId('text-highscore');
        expect(element).toHaveTextContent('High Score: 0');
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

    it('Should update high score when current score exeeds previous high score', async () => {
        const {getAllByTestId} = render(<BrowserRouter><GamePage /></BrowserRouter>);
        const panels = getAllByTestId("panel");
        const highscoreText = getAllByTestId("text-highscore")[0];
        const panel0MarketCap = parseInt(panels[0].querySelector('[data-testid="market-cap"]').textContent);
        const panel1MarketCap = parseInt(panels[1].querySelector('[data-testid="market-cap"]').textContent);
        const correctPanelIndex = panel0MarketCap >= panel1MarketCap ? 0 : 1;
        act(() => {
            panels[correctPanelIndex].click()
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
        const updatedHighscore = parseInt(highscoreText.textContent.split(":")[1].trim());
        expect(updatedHighscore).toBe(1);
    });

})