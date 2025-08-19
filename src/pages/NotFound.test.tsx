import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFoundPage';

describe('NotFound component', () => {
  test('renders the 404 message and link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText('404')).toBeInTheDocument();

    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /На главную/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
