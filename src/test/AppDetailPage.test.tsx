import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { APPLICATIONS } from '../data';
import { renderWithProviders } from './utils';

// AppDetailPage reads :appId via useParams, so it must be rendered through
// the App's <Routes> tree — not directly. We mount <App /> and navigate.
function renderAppAt(path: string) {
  return renderWithProviders(<App />, {
    routerProps: { initialEntries: [path] },
  });
}

describe('AppDetailPage', () => {
  it('renders the app name and description for a valid appId', () => {
    const app = APPLICATIONS[0]; // Booking Platform
    renderAppAt(`/apps/${app.id}`);
    expect(screen.getByText(app.name)).toBeInTheDocument();
    expect(screen.getByText(app.description)).toBeInTheDocument();
  });

  it('shows the not-found state for an invalid appId', () => {
    renderAppAt('/apps/nonexistent-app');
    expect(screen.getByText('Application not found')).toBeInTheDocument();
  });

  it('shows a launch link when the app is accessible for the selected company', () => {
    const app = APPLICATIONS.find((a) => a.id === 'booking-platform')!;
    renderAppAt(`/apps/${app.id}`);
    const launchLink = screen.getByRole('link', { name: new RegExp(`Launch ${app.name}`) });
    expect(launchLink).toHaveAttribute('href', app.launchUrl);
    expect(launchLink).toHaveAttribute('target', '_blank');
  });

  it('hides the launch button and shows "not available" when the app is not accessible', () => {
    const app = APPLICATIONS.find((a) => a.id === 'agent-support')!;
    renderAppAt(`/apps/${app.id}`);
    expect(screen.queryByText(`Launch ${app.name}`)).not.toBeInTheDocument();
    expect(screen.getByText('Not available for selected company')).toBeInTheDocument();
  });

  it('lists the companies where the app is available', () => {
    const app = APPLICATIONS.find((a) => a.id === 'crm')!;
    renderAppAt(`/apps/${app.id}`);
    expect(screen.getByText('Available in companies')).toBeInTheDocument();
  });

  it('has a Back button', () => {
    const app = APPLICATIONS[0];
    renderAppAt(`/apps/${app.id}`);
    expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument();
  });

  it('includes quick action links to /news and /help', () => {
    const app = APPLICATIONS[0];
    renderAppAt(`/apps/${app.id}`);
    expect(screen.getByText('View related alerts & incidents')).toBeInTheDocument();
    expect(screen.getByText('Get support for this tool')).toBeInTheDocument();
  });
});
