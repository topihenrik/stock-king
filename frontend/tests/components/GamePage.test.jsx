import {describe, it, expect} from "vitest";
import {setupWithProviders} from "../test-utils.jsx";
import {within} from '@testing-library/dom';
import GamePage from "../../src/components/GamePage.jsx";
import {useCurrencyStore} from "../../src/stores/currency-store.jsx";
import {useScoreStore} from "../../src/stores/score-store.jsx";
import {companies} from "../mock-data/companies.js";

const delay = ms => new Promise(res => setTimeout(res, ms));

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
            useCurrencyStore.setState({gameCurrency: "EUR"});
        });

        it("Should display correct currency based on game currency", async () => {
            const {findAllByTestId} = setupWithProviders(<GamePage/>);

            const marketCaps = await findAllByTestId("market-cap");

            expect(marketCaps[0]).toHaveTextContent("€");
        });
    });

    it('Should render placeholder logo when image URL is invalid', async () => {
        const {findByAltText} = setupWithProviders(<GamePage/>);

        const img = await findByAltText('RBC Bearings Incorporated');

        // Separately trigger an onError event, as vitest cannot verify the validity of URLs
        img.dispatchEvent(new Event('error'));

        const placeholderLogo = await findByAltText('Placeholder logo');
        expect(placeholderLogo).toBeTruthy();
    });

    it('Should refetch data and change difficulty when current score reaches the threshold', async () => {
        const {findAllByTestId, user} = setupWithProviders(<GamePage/>);

        useScoreStore.setState({ score: 8 });

        const panels = await findAllByTestId("panel");
        await user.click(panels[0]);

        await delay(1100);

        // The first panel should be the previous second panel
        const firstPanelText = await within(panels[0]).findByText(companies.easy[0].name);
        expect(firstPanelText).toBeInTheDocument();

        // The second panel should be the first fetched company
        const secondPanelText = await within(panels[1]).findByText(companies.medium[0].name);
        expect(secondPanelText).toBeInTheDocument();
    }, 10000);

    it('Should show hint when lightbulb button is pressed', async () => {
        const {findByTestId, findAllByTestId, user} = setupWithProviders(<GamePage />);

        const lightbulbButton = await findByTestId('button-lightbulb');
        await user.click(lightbulbButton);

        const hintTexts = await findAllByTestId('hint-text');
        expect(hintTexts[0]).toHaveTextContent('5092');
        expect(hintTexts[1]).toHaveTextContent('5330');
    });

    it('Should decrement hint count when lightbulb button is pressed', async () => {
        const {findByTestId, user} = setupWithProviders(<GamePage />);

        const initialHintCount = await findByTestId('hint-count');
        expect(initialHintCount).toHaveTextContent(3);

        const lightbulbButton = await findByTestId('button-lightbulb');
        await user.click(lightbulbButton);

        const hintCount = await findByTestId('hint-count');
        expect(hintCount).toHaveTextContent(2);
    });

    it('Should count any selection as correct when formatted market caps are identical', async () => {
        const {findAllByTestId, findByTestId, user} = setupWithProviders(<GamePage/>);

        const panels = await findAllByTestId("panel");
        const scoreText = await findByTestId("text-score");

        // Market caps for the first three companies are identical when formatted
        // Technically correct selection
        await user.click(panels[0]);

        await delay(2000);

        // Technically incorrect selection
        await user.click(panels[1]);

        expect(scoreText).toHaveTextContent('2');
    }, 5000);
})