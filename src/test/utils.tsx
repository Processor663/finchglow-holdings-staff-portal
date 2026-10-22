import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import type { ReactElement } from 'react';
import { PortalProvider } from '../context';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: MemoryRouterProps;
}

/**
 * Render a component wrapped in PortalProvider + MemoryRouter so tests can
 * exercise routing and the portal context without needing a real browser.
 */
export function renderWithProviders(
  ui: ReactElement,
  { routerProps, ...renderOptions }: RenderWithProvidersOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter {...routerProps}>
        <PortalProvider>{children}</PortalProvider>
      </MemoryRouter>
    ),
    ...renderOptions,
  });
}
