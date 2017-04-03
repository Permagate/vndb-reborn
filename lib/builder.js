module.exports = { login, dbstats, get, set };

function login (data) {
  if (!data) {
    throw new Error('Login command is missing body argument.');
  }

  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Login command has non-object body argument.');
  }

  return `login ${JSON.stringify(data)}`;
}

function dbstats () {
  return 'dbstats';
}

function get (data) {
  // Part 1 - Sanity Checking
  const missingArguments = [];

  const type = data ? data.type : null;
  if (!type) {
    missingArguments.push('type');
  }

  const flags = data ? data.flags : null;
  if (!flags) {
    missingArguments.push('flags');
  }

  const filters = data ? data.filters : null;
  if (!filters) {
    missingArguments.push('filters');
  }

  if (missingArguments.length > 0) {
    throw new Error(`Get command is missing ${missingArguments.join(', ')} argument(s).`);
  }

  let options = data ? data.options : '';
  if (options) {
    if (typeof options !== 'object' || Array.isArray(options)) {
      throw new Error('Get command has non-object options argument.');
    }

    options = Object.keys(options).length > 0 ? JSON.stringify(options) : '';
  }

  // Part 2 - Normalization
  const normalType = type.toString();

  const normalFlags = Array.isArray(flags) ?
    flags.join(',') :
    flags.toString().replace(/ /, '');

  const normalFilters = filters.toString().replace(/^\(*/, '(').replace(/\)*$/, ')');

  const normalOptions = options;

  // Part 3 - Mash them all
  const result = `get ${normalType} ${normalFlags} ${normalFilters}`;
  return normalOptions ? `${result} ${normalOptions}` : result;
}

function set () {
}

