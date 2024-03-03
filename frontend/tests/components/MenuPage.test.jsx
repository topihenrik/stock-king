import { describe, it, expect } from "vitest";
import {act} from "@testing-library/react";
import {setupWithProviders} from "../test-utils.jsx";
import MenuPage from "../../src/components/MenuPage.jsx";

describe('MenuPage', () => {
    it('Should show correct text on dropdown menu', async () => {
        const {getByTestId} = setupWithProviders(<MenuPage/>);

        const dropdownButton = getByTestId('category-btn');

        expect(dropdownButton).toHaveTextContent('Choose category');
    });

    it('Should update text after selecting category from dropdown menu', async () => {
        const { findByTestId, user } = setupWithProviders(<MenuPage/>);

        const dropdownButton = await findByTestId('category-btn');

        await act(async () => {
            await user.click(dropdownButton);
        })

        const category1 = await findByTestId('category1');

        await act(async () => {
            await user.click(category1);
        });

        expect(dropdownButton).toHaveTextContent('Category 1');
    });

    it('Should go to game view after pressing start game button', async () => {
        const { findByTestId, user } = setupWithProviders(<MenuPage/>);

        const startGameButton = await findByTestId('start-btn');

        await act(async () => {
            await user.click(startGameButton)
        });

        expect(window.location.pathname).toBe('/game');
    });
})
