const prefix = '/api';

let store;

const defaultOptions = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

function getStore(configuredStore) {
  store = configuredStore;
}

function getDefaultOptions(newOptions = {}, withToken) {
  const options = Object.assign({}, JSON.parse(JSON.stringify(defaultOptions)), newOptions);

  const state = store.getState();
  const { accessToken } = state.auth;

  if (accessToken && withToken) {
    options.headers.authorization = `Bearer ${accessToken}`;
  }

  return options;
}

function parseJSON(response) {
  const remember = {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
  };

  return new Promise((resolve) =>
    response.json()
      .then((json) => resolve({ ...remember, parsedJson: json }))
      .catch(() => resolve(remember)));
}

function request(endpoint, options) {
  return new Promise((resolve, reject) =>
    fetch(endpoint, options)
      .then((result) => parseJSON(result))
      .then((response) => {
        if (response.ok) {
          if (response.parsedJson) {
            return resolve(response.parsedJson);
          }

          return resolve(null);
        }

        if (response.status === 401 && store.getState().auth.accessToken) {
          // logout user
        }

        const { parsedJson } = response;

        if (parsedJson && parsedJson.Message) {
          const error = new Error(parsedJson.Message);
          error.response = response;
          return reject(error);
        }

        const error = new Error(`${response.status}: ${response.statusText}`);
        error.response = response;
        return reject(error);
      })
      .catch((response) => {
        const error = new Error(`Error: status: ${response.status} - ${response.statusText}, message: ${response.message}`);
        error.response = response;

        /* if (response.name !== 'AbortError') {

        } */

        return reject(error);
      }));
}

export default {
  prefix,
  getStore,
  defaultOptions,
  get: (endpoint, options, withToken = true) =>
    request(endpoint, { method: 'GET', ...getDefaultOptions(options, withToken) }),
  post: (endpoint, options, withToken = true) =>
    request(endpoint, { method: 'POST', ...getDefaultOptions(options, withToken) }),
  put: (endpoint, options, withToken = true) =>
    request(endpoint, { method: 'PUT', ...getDefaultOptions(options, withToken) }),
  delete: (endpoint, options, withToken = true) =>
    request(endpoint, { method: 'DELETE', ...getDefaultOptions(options, withToken) }),
};
