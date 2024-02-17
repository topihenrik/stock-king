import {describe, it, expect} from "vitest";
import {render} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import GameOverPage from "../../src/components/GameOverPage.jsx";

describe('GameOverPage', () => {
    it('Should show correct high score', () => {
        const {getByTestId} = render(<BrowserRouter><GameOverPage highScore={16}/></BrowserRouter>);
        const element = getByTestId('text-highscore');
        expect(element).toHaveTextContent('High Score: 16');
    });

    it('Should show correct score', () => {
        const {getByTestId} = render(<BrowserRouter><GameOverPage/></BrowserRouter>);
        const element = getByTestId('text-score');
        expect(element).toHaveTextContent('Your Score: 0');
    });
})