import { describe, it, expect } from "vitest";
import {setupWithProviders} from "../test-utils.jsx";
import MenuPage from "../../src/components/MenuPage.jsx";
import { useGameStore } from "../../src/stores/game-store.jsx";

describe('MenuPage', () => {
    it('Should show correct text on dropdown menu', async () => {
        const {getByTestId} = setupWithProviders(<MenuPage/>);

        const dropdownButton = getByTestId('category-btn');

        expect(dropdownButton).toHaveTextContent('chooseCategory');
    });

    it('Should update text after selecting category from dropdown menu', async () => {
        const { findByTestId, user } = setupWithProviders(<MenuPage/>);

        const dropdownButton = await findByTestId('category-btn');

        await user.click(dropdownButton);

        const category1 = await findByTestId('category1');

        await user.click(category1);

        expect(dropdownButton).toHaveTextContent('Category 1');
    });

    it('Should update language menu text after selecting another language', async () => {
        const { findByTestId, user } = setupWithProviders(<MenuPage/>);

        const menu = await findByTestId('language-button');

        expect(menu).toHaveTextContent('en');

        await user.click(menu);

        const menuItem1 = await findByTestId('language-menu-item-2');

        await user.click(menuItem1);

        expect(menu).toHaveTextContent('fi');
    });

    it('Should go to game view after pressing start game button', async () => {
        const { findByTestId, user } = setupWithProviders(<MenuPage/>);

        const startGameButton = await findByTestId('start-btn');

        await user.click(startGameButton)

        expect(window.location.pathname).toBe('/game');
    });

    it("Should update game currency after selecting currency from dropdown menu", async () => {
        const { findByTestId, findByText, user } = setupWithProviders(<MenuPage />);
      
        const dropdownButton = await findByTestId("currency-btn");

        await user.click(dropdownButton);
      
        const currencySEK = await findByText("SEK");


        await user.click(currencySEK);
      
        expect(useGameStore.getState().gameCurrency).toBe("SEK");
    });

})
