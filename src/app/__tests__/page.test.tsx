import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders without errors', () => {
    render(<Home />);
    expect(screen.getByAltText('Next.js logo')).toBeInTheDocument();
  });
});
