import {describe, it, expect} from "vitest";
import {setupWithProviders} from "../test-utils.jsx";
import GameOverPage from "../../src/components/GameOverPage.jsx";

describe('GameOverPage', () => {
    it('Should show high score', () => {
        const {getByTestId} = setupWithProviders(<GameOverPage/>);
        const element = getByTestId('text-highscore');
        expect(element).toHaveTextContent('High Score: 0');
    });

    it('Should show score', () => {
        const {getByTestId} = setupWithProviders(<GameOverPage/>);
        const element = getByTestId('text-score');
        expect(element).toHaveTextContent('Your Score: 0');
    });
})