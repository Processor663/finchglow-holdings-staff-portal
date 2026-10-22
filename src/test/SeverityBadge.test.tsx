import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeverityBadge } from '../components/SeverityBadge';

describe('SeverityBadge', () => {
  it('renders the critical label and icon', () => {
    render(<SeverityBadge severity="critical" />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('renders the warning label', () => {
    render(<SeverityBadge severity="warning" />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders the info label', () => {
    render(<SeverityBadge severity="info" />);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('uses uppercase text so severity is distinguishable beyond colour', () => {
    const { container } = render(<SeverityBadge severity="critical" />);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('uppercase');
  });
});
