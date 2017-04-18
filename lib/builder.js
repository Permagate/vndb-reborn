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
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Get command has non-object argument.');
  }

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

function set (data) {
  // Part 1 - Sanity Checking
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Set command has non-object argument.');
  }

  const missingArguments = [];

  const type = data ? data.type : null;
  if (!type) {
    missingArguments.push('type');
  }

  const id = data ? data.id : null;
  if (!id) {
    missingArguments.push('id');
  }

  let fields = data ? data.fields : null;
  if (!fields) {
    missingArguments.push('fields');
  } else {
    if (typeof fields !== 'object' || Array.isArray(fields)) {
      throw new Error('Set command has non-object fields argument.');
    }

    fields = Object.keys(fields).length > 0 ? JSON.stringify(fields) : '';
  }

  if (missingArguments.length > 0) {
    throw new Error(`Set command is missing ${missingArguments.join(', ')} argument(s).`);
  }

  // Part 2 - Normalization
  const normalType = type.toString();

  const normalId = Number(id);

  const normalFields = fields;

  // Part 3 - Mash them all
  return `set ${normalType} ${normalId} ${normalFields}`;
}

