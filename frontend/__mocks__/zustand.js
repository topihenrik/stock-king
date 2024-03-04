import { act } from '@testing-library/react';
const { create: actualCreate, createStore: actualCreateStore } = await vi.importActual('zustand');

export const storeResetFns = new Set()

const createUncurried = (stateCreator) => {
    const store = actualCreate(stateCreator)
    const initialState = store.getInitialState()
    storeResetFns.add(() => {
        store.setState(initialState, true)
    })
    return store;
}

export const create = ((stateCreator) => (
    typeof stateCreator === 'function' ? createUncurried(stateCreator) : createUncurried
));

const createStoreUncurried = (stateCreator) => {
    const store = actualCreateStore(stateCreator)
    const initialState = store.getInitialState()
    storeResetFns.add(() => {
        store.setState(initialState, true)
    })
    return store;
}

export const createStore = ((stateCreator) => (
    typeof stateCreator === 'function' ? createStoreUncurried(stateCreator) : createStoreUncurried
));

afterEach(() => {
    act(() => {
        storeResetFns.forEach((resetFn) => {
            resetFn()
        })
    })
})