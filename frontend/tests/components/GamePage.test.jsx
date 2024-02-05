import {describe, it, expect} from "vitest";
import {render} from "@testing-library/react";
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
})