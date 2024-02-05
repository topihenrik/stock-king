import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MenuPage from "../../src/components/MenuPage.jsx";

describe('MenuPage', () => {
    it('Should show correct text on dropdown menu', () => {
        const {getByTestId} = render(<BrowserRouter><MenuPage/></BrowserRouter>);
        const element = getByTestId('category-btn');
        expect(element).toHaveTextContent('Choose category');
    });

    it('Should update text after selecting category from dropdown menu', () => {
        const { getByTestId } = render(<BrowserRouter><MenuPage /></BrowserRouter>);
        const dropdownButton = getByTestId('category-btn');
        fireEvent.click(dropdownButton);
        fireEvent.click(getByTestId('category1'));
        const updatedText = getByTestId('category-btn').textContent;
        expect(updatedText).toContain('Category 1');
    });

    test('Should go to game view after pressing start game button', async () => {
        const { getByTestId } = render(<BrowserRouter><MenuPage /></BrowserRouter>);
        const startGameButton = getByTestId('start-btn');
        startGameButton.click();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(window.location.pathname).toBe('/game');
    });
})
