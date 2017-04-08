/**
 * Parse response that we get from VNDB.
 *
 * All must return an object with the following structure:
 *  {
 *    isError: true/false,
 *    result: parsed result,
 *  }
 *
 * But if the response is unparse-able, return null.
 */
module.exports = { login, dbstats, get, set, error };

function login (response) {
  return {
    isError: false,
    result: response,
  };
}

function dbstats (response) {
  if (response && response.substr(0, 7) !== 'dbstats') {
    return null;
  }

  try {
    return {
      isError: false,
      result: JSON.parse(response.substr(8)),
    };
  } catch (e) {
    throw new Error(`Unexpected response: ${response}`);
  }
}

function get (response) {
  if (response && response.substr(0, 7) !== 'results') {
    return null;
  }

  try {
    return {
      isError: false,
      result: JSON.parse(response.substr(8)),
    };
  } catch (e) {
    throw new Error(`Unexpected response: ${response}`);
  }
}

function set (response) {
  return {
    isError: false,
    result: response,
  };
}

function error (response) {
  if (response && response.substr(0, 5) !== 'error') {
    return null;
  }

  try {
    return {
      isError: true,
      result: JSON.parse(response.substr(6)),
    };
  } catch (e) {
    throw new Error(`Unexpected response: ${response}`);
  }
}

