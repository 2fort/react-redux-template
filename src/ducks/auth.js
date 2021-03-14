import produce from 'immer';

const prefix = 'Auth';

const SET_AUTHORIZED = `${prefix}/SET_AUTHORIZED`;
const SET_UNAUTHORIZED = `${prefix}/SET_UNAUTHORIZED`;

export function signIn(token) {
  localStorage.setItem('accessToken', token);

  return {
    type: SET_AUTHORIZED,
    token,
  };
}

export function signOut() {
  localStorage.removeItem('accessToken');

  return {
    type: SET_UNAUTHORIZED,
  };
}

const initialState = {
  accessToken: localStorage.getItem('accessToken') || '',
};

/* eslint-disable default-case */

const reducer = produce((draft, action) => {
  switch (action.type) {
    case SET_AUTHORIZED:
      draft.accessToken = action.token;
      return;

    case SET_UNAUTHORIZED:
      draft.accessToken = '';
  }
}, initialState);

export default reducer;

/* eslint-disable default-case */
