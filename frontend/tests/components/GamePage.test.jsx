import {describe, it, expect} from "vitest";
import {act} from "@testing-library/react";
import {setupWithProviders} from "../test-utils.jsx";
import GamePage from "../../src/components/GamePage.jsx";
import { useGameStore } from "../../src/stores/game-store.jsx";

describe('GamePage', () => {
    it('Should create company panels', async () => {
        const {findAllByTestId} = setupWithProviders(<GamePage/>);

        const panels = await findAllByTestId('panel');

        expect(panels.length).toBe(2);
    });

    it('Should show the correct initial value for high score', () => {
        const {getByTestId} = setupWithProviders(<GamePage/>);

        const highScoreText = getByTestId('text-highscore');

        expect(highScoreText).toHaveTextContent('0');
    });

    it('Should update score properly', async () => {
        const {findAllByTestId, findByTestId, user} = setupWithProviders(<GamePage/>);

        const panels = await findAllByTestId("panel");
        const scoreText = await findByTestId("text-score");

        await act(async () => {
            await user.click(panels[0]);
        });

        expect(scoreText).toHaveTextContent('1');
    });

    it('Should update high score when current score exceeds the previous high score', async () => {
        const {findAllByTestId, findByTestId, user} = setupWithProviders(<GamePage/>);

        const panels = await findAllByTestId("panel");
        const highScoreText = await findByTestId("text-highscore");

        expect(highScoreText).toHaveTextContent('0');

        await act(async () => {
            await user.click(panels[0]);
        });

        expect(highScoreText).toHaveTextContent('1');
    });

    it("Should display correct currency based on game currency", async () => {
        const {findAllByTestId} = setupWithProviders(<GamePage/>);

        act(() => {
            useGameStore.setState({ gameCurrency: "EUR" });
        });

        const marketCaps = await findAllByTestId("market-cap");
    
        marketCaps.forEach((marketCap) => {
            expect(marketCap).toHaveTextContent("€");
        })
      });

})