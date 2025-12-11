import { render, screen } from '@testing-library/react'
import Page from '../page'

describe('Page', () => {
  it('renders without errors', () => {
    render(<Page />)
    expect(screen.getByText('My Portfolio')).toBeInTheDocument()
  })
})
