import * as React from 'react';
import { render, cleanup } from '../test-utils';
import Header from './Header';

afterEach(cleanup);

test('renders header', () => {
  const { getByText } = render(<Header />);
  const button1 = getByText(/Main/i);
  const button2 = getByText(/Protected Page/i);
  expect(button1).toBeInTheDocument();
  expect(button2).toBeInTheDocument();
});
