import {render} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";

export const setupWithProviders = (node) => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </BrowserRouter>
    );

    return { user: userEvent.setup(), ...render(node, {wrapper})};
};