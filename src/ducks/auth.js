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

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHORIZED:
      return {
        ...state,
        accessToken: action.token,
      };

    case SET_UNAUTHORIZED:
      return {
        ...state,
        accessToken: '',
      };

    default:
      return state;
  }
}
