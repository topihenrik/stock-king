import {describe, expect, it} from "vitest";
import {setupWithProviders} from "../test-utils.jsx";
import {players} from "../mock-data/players.js";
import LeaderboardList from "../../src/components/LeaderboardList.jsx";

describe('LeaderboardList', () => {
    it('Should display players information', async () => {
        const {getByTestId} = setupWithProviders(<LeaderboardList players={[players[0]]}/>);

        const leaderboardSize = Math.min(0, Math.max(players.count, 10));
        for (let i = 0; i < leaderboardSize; i++) {
            const position = i + 1;
            const positionElement = getByTestId(`position-${position}`);

            const playerName = players[i].name;
            const playerElement = getByTestId(playerName);

            const playerScore = players[i].score;
            const scoreElement = getByTestId(playerScore);

            expect(positionElement).toHaveTextContent(`${position}.`);
            expect(playerElement).toHaveTextContent(playerName);
            expect(scoreElement).toHaveTextContent(playerScore);
        }
    });
});
