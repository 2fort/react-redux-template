const prefix = '/api';

let store;

function getStore(configuredStore) {
  store = configuredStore;
}

function getDefaultOptions(newOptions = {}, withToken) {
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...newOptions,
  };

  const state = store.getState();
  const { accessToken } = state.auth;

  if (accessToken && withToken) {
    options.headers.authorization = `Bearer ${accessToken}`;
  }

  return options;
}

function parseJSON(response, method) {
  const remember = {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
  };

  return new Promise((resolve) =>
    response[method]()
      .then((json) => resolve({ ...remember, parsedJson: json }))
      .catch(() => resolve(remember)));
}

function request(endpoint, options) {
  return new Promise((resolve, reject) =>
    fetch(endpoint, options)
      .then((response) => {
        const contentType = response.headers.get('content-type');

        // text
        if (!contentType || contentType.includes('text/plain')) {
          return parseJSON(response, 'text');
        }

        // blob
        const contentDisposition = response.headers.get('content-disposition');
        const filenameIndex = !!contentDisposition && contentDisposition.indexOf('filename*=UTF-8');

        if (contentDisposition && filenameIndex !== -1) {
          return parseJSON(response, 'blob');
        }

        // json
        if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
          return parseJSON(response, 'json');
        }

        // default
        return parseJSON(response, 'text');
      })
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

        const error = new Error(response.statusText ? `${response.status}: ${response.statusText}` : response.status);
        error.response = response;
        return reject(error);
      })
      .catch((response) => {
        const errorMessage = (response.status || response.statusText)
          ? `Error: status: ${response.status} - ${response.statusText}, message: ${response.message}`
          : response.message;

        const error = new Error(errorMessage);
        error.response = response;
        error.name = response.name;

        /* if (response.name !== 'AbortError') {
          // global notification
        } */

        return reject(error);
      }));
}

export default {
  prefix,
  getStore,
  getDefaultOptions,
  get: (endpoint, options, withToken = true) =>
    request(endpoint, { method: 'GET', ...getDefaultOptions(options, withToken) }),
  post: (endpoint, options, withToken = true) =>
    request(endpoint, { method: 'POST', ...getDefaultOptions(options, withToken) }),
  put: (endpoint, options, withToken = true) =>
    request(endpoint, { method: 'PUT', ...getDefaultOptions(options, withToken) }),
  delete: (endpoint, options, withToken = true) =>
    request(endpoint, { method: 'DELETE', ...getDefaultOptions(options, withToken) }),
};
