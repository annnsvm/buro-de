import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { rootReducer, type RootState } from '@/redux/rootReducer';
import { setStore } from '@/redux/storeRef';

export type AppStore = ReturnType<typeof configureStoreWithRootReducer>;

const configureStoreWithRootReducer = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  preloadedState?: PreloadedState<RootState>;
  initialEntries?: string[];
};

export const renderWithProviders = (
  ui: ReactElement,
  { preloadedState, initialEntries = ['/'], ...renderOptions }: RenderWithProvidersOptions = {},
) => {
  const store = configureStoreWithRootReducer(preloadedState);
  setStore(store);

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
