import {describe, it, expect} from "vitest";
import {setupWithProviders} from "../test-utils.jsx";
import { localStorageMock } from "../../__mocks__/localStorage.js";
import GameHistoryModal from "../../src/components/GameHistoryModal.jsx";
  
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('GameHistory', () => {
    it('should render game history table with correct data', async () => {
        const gameHist = [
            { date: "2024-03-27T19:59:08.224Z", score: 0 },
            { date: "2024-03-26T11:47:28.224Z", score: 11 },
        ];


        localStorage.setItem('gameHistory', JSON.stringify(gameHist));

        const {findAllByTestId} = setupWithProviders(<GameHistoryModal open={true} setOpen={() => {}} />);

        const dateCells = await findAllByTestId("date-cell");
        expect(dateCells[0].textContent).toBe('27.3.2024');
        expect(dateCells[1].textContent).toBe('26.3.2024');

        const scoreCells = await findAllByTestId("score-cell");
        expect(scoreCells[0].textContent).toBe('0');
        expect(scoreCells[1].textContent).toBe('11');
    });
});
