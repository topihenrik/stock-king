import {describe, it, expect} from "vitest";
import {render} from "@testing-library/react";
import GameOverPage from "../../src/components/GameOverPage.jsx";

describe('GameOverPage', () => {
    it('Should show correct high score', () => {
        const {getByTestId} = render(<GameOverPage highScore={16}/>);
        const element = getByTestId('text-highscore');
        expect(element).toHaveTextContent('High Score: 16');
    });

    it('Should show correct score', () => {
        const {getByTestId} = render(<GameOverPage score={8}/>);
        const element = getByTestId('text-score');
        expect(element).toHaveTextContent('Your Score: 8');
    });
})