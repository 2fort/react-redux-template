import { render } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'react-jss';
import api from './api';
import { createBreakpoints } from './shared/utils';
import configureStore from './store-app';
import Entrance from './Entrance';

const theme = {
  bp: createBreakpoints(),
};

/* eslint-disable import/no-mutable-exports */
let store = configureStore();
api.getStore(store);

const AllTheProviders = ({ children }) => { // eslint-disable-line
  return (
    <ReduxProvider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <Entrance />
        </ThemeProvider>
      </Router>
    </ReduxProvider>
  );
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

function resetStore() {
  store = configureStore();
}

export * from '@testing-library/react';
export {
  customRender as render,
  store,
  resetStore,
};

/* eslint-enable import/no-mutable-exports */
