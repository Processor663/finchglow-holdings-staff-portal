import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithProviders } from './utils';

// Render the full app shell with a router so we can test navigation between pages.
function renderApp(initialEntry = '/') {
  return renderWithProviders(<App />, {
    routerProps: { initialEntries: [initialEntry] },
  });
}

describe('App routing and navigation', () => {
  it('renders the home page by default with the welcome greeting', () => {
    renderApp('/');
    // The welcome section contains "Welcome to your Finchglow workspace."
    expect(screen.getByText('Welcome to your Finchglow workspace.')).toBeInTheDocument();
  });

  it('navigates to the applications page via the sidebar link', async () => {
    const user = userEvent.setup();
    renderApp('/');
    const appsLink = screen.getByRole('link', { name: /My Applications/ });
    await user.click(appsLink);
    expect(
      screen.getByText('Tools available to you for the selected company. Click any app to view details and launch.'),
    ).toBeInTheDocument();
  });

  it('navigates to an app detail page when a card is clicked', async () => {
    const user = userEvent.setup();
    renderApp('/applications');
    const bookingCard = screen.getByRole('link', { name: /Booking Platform/ });
    await user.click(bookingCard);
    expect(screen.getByText('Available in companies')).toBeInTheDocument();
    expect(screen.getByText('Search and book flights, hotels and ground transport.')).toBeInTheDocument();
  });

  it('navigates to the news page', async () => {
    const user = userEvent.setup();
    renderApp('/');
    const newsLink = screen.getByRole('link', { name: /News & Alerts/ });
    await user.click(newsLink);
    expect(
      screen.getByText(
        'Group-wide and company-specific announcements, warnings, and critical incidents.',
      ),
    ).toBeInTheDocument();
  });

  it('navigates to the help page', async () => {
    const user = userEvent.setup();
    renderApp('/');
    const helpLink = screen.getByRole('link', { name: /Help & Support/ });
    await user.click(helpLink);
    expect(screen.getByText('Find answers, contact support, and raise requests.')).toBeInTheDocument();
  });

  it('redirects unknown routes back to home', () => {
    renderApp('/this-route-does-not-exist');
    expect(screen.getByText('Welcome to your Finchglow workspace.')).toBeInTheDocument();
  });

  it('shows the critical incident banner on the home page', () => {
    renderApp('/');
    // The critical banner title appears in both the banner and possibly the
    // notification bell dropdown — use getAllByText to assert at least one.
    expect(screen.getAllByText('Payment gateway disruption').length).toBeGreaterThan(0);
  });

  it('renders the brand mark in the sidebar', () => {
    renderApp('/');
    expect(screen.getAllByText('Finchglow').length).toBeGreaterThan(0);
  });

  it('shows the employee name in the sidebar profile area', () => {
    renderApp('/');
    // Employee name appears in both the sidebar profile and the top bar avatar area
    expect(screen.getAllByText('Amadi Miracle').length).toBeGreaterThan(0);
  });
});
