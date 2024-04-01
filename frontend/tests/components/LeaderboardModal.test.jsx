import {describe, expect, it} from "vitest";
import {setupWithProviders} from "../test-utils.jsx";
import LeaderboardModal from "../../src/components/LeaderboardModal.jsx";
import {players} from "../mock-data/players.js";

describe('LeaderboardModal', () => {
    it('Should show top 10 scoring players', async () => {
        const {findByTestId, queryByText} = setupWithProviders(<LeaderboardModal open={true} setOpen={vi.fn}/>);
        const headerElement = await findByTestId('leaderboard-header');

        const leaderboardSize = Math.min(0, Math.max(players.count, 10));
        for (let i = 0; i < leaderboardSize; i++) {
            const playerName = players[i].name;
            const playerElement = queryByText(playerName);
            expect(playerElement).not.toBeNull();
        }

        expect(headerElement).toHaveTextContent('top10Leaderboard');
    });
});
