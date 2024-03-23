import {describe, it, expect} from "vitest";
import {setupWithProviders} from "../test-utils.jsx";
import {within} from '@testing-library/dom';
import GamePage from "../../src/components/GamePage.jsx";
import {useGameStore} from "../../src/stores/game-store.jsx";

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

        await user.click(panels[0]);

        expect(scoreText).toHaveTextContent('1');
    });

    it('Should update high score when current score exceeds the previous high score', async () => {
        const {findAllByTestId, findByTestId, user} = setupWithProviders(<GamePage/>);

        const panels = await findAllByTestId("panel");
        const highScoreText = await findByTestId("text-highscore");

        expect(highScoreText).toHaveTextContent('0');

        await user.click(panels[0]);

        expect(highScoreText).toHaveTextContent('1');
    });

    describe('Currency', async () => {
        beforeEach(() => {
            useGameStore.setState({gameCurrency: "EUR"});
        });

        it("Should display correct currency based on game currency", async () => {
            const {findAllByTestId} = setupWithProviders(<GamePage/>);

            const marketCaps = await findAllByTestId("market-cap");

            expect(marketCaps[0]).toHaveTextContent("€");
        });
    });

    it('Should render placeholder logo when image URL is invalid', async () => {
        const {findByAltText} = setupWithProviders(<GamePage/>);

        const img = await findByAltText('Archer-Daniels-Midland Company');

        // Separately trigger an onError event, as vitest cannot verify the validity of URLs
        img.dispatchEvent(new Event('error'));

        const placeholderLogo = await findByAltText('Placeholder logo');
        expect(placeholderLogo).toBeTruthy();
    });

    it('Should refetch data when current score reaches the threshold', async () => {
        const {findAllByTestId, user} = setupWithProviders(<GamePage/>);

        useGameStore.setState({ score: 18 });

        const panels = await findAllByTestId("panel");
        await user.click(panels[0]);

        // The first panel should be the previous second panel
        const firstPanelText = await within(panels[0]).findByText('Jacobs Solutions Inc.');
        expect(firstPanelText).toBeInTheDocument();

        // The second panel should be the first fetched company
        const secondPanelText = await within(panels[1]).findByText('Essex Property Trust, Inc.');
        expect(secondPanelText).toBeInTheDocument();
    });
})