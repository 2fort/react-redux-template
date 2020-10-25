import 'core-js/stable';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'react-jss';
import 'normalize.css';
import './style.css';
import Entrance from './Entrance';
import configureStore from './store-app';
import api from './api';
import { createBreakpoints } from './shared/utils';

const theme = {
  bp: createBreakpoints(),
};

const store = configureStore();
api.getStore(store);

render(
  <ReduxProvider store={store}>
    <Router>
      <ThemeProvider theme={theme}>
        <Entrance />
      </ThemeProvider>
    </Router>
  </ReduxProvider>,
  document.getElementById('app'),
);
