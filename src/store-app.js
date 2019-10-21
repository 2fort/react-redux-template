import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import api from './api';
import main from './ducks/main';
import auth from './ducks/auth';

const rootReducer = combineReducers({
  main,
  auth,
});

const middlewares = [thunk.withExtraArgument(api)];

const composeEnhancers = composeWithDevTools({});

export default function configureStore() {
  let store = '';

  if (process.env.NODE_ENV === 'development') {
    store = createStore(
      rootReducer,
      composeEnhancers(applyMiddleware(...middlewares)),
    );

    if (module.hot) {
      module.hot.accept();
      store.replaceReducer(rootReducer);
    }
  } else {
    store = createStore(rootReducer, applyMiddleware(...middlewares));
  }

  return store;
}
