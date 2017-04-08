/* eslint-env jest */
const Parser = require('../lib/parser');

describe('Query parser', () => {
  describe('login', () => {
    test('ok', () => {
      const res0 = Parser.login('ok');

      expect(res0.isError).toBe(false);
      expect(res0.result).toBe('ok');
    });
  });

  describe('dbstats', () => {
    test('ok', () => {
      const res0 = Parser.dbstats('dbstats {"vn":30000,"users":5}');
      const res1 = Parser.dbstats('error {"id":"parse"}');

      expect(res0.isError).toBe(false);
      expect(res0.result).toEqual(expect.objectContaining({
        vn: 30000,
        users: 5,
      }));
      expect(res1).toBe(null);
    });

    test('error', () => {
      try {
        Parser.dbstats('dbstats invalid response');
      } catch (e) {
        expect(e.message).toBe('Unexpected response: dbstats invalid response');
      }

      expect.assertions(1);
    });
  });

  describe('get', () => {
    test('ok', () => {
      const res0 = Parser.get('results {"num":0,"more":false,"items":[]}');
      const res1 = Parser.get('error {"id":"parse"}');

      expect(res0.isError).toBe(false);
      expect(res0.result).toEqual(expect.objectContaining({
        num: 0,
        more: false,
        items: [],
      }));
      expect(res1).toBe(null);
    });

    test('error', () => {
      try {
        Parser.get('results invalid response');
      } catch (e) {
        expect(e.message).toBe('Unexpected response: results invalid response');
      }

      expect.assertions(1);
    });
  });

  describe('set', () => {
    test('ok', () => {
      const res0 = Parser.set('ok');

      expect(res0.isError).toBe(false);
      expect(res0.result).toBe('ok');
    });
  });

  describe('error', () => {
    test('ok', () => {
      const res0 = Parser.error('error {"id":"parse"}');
      const res1 = Parser.error('results {"num":0,"more":false,"items":[]}');

      expect(res0.isError).toBe(true);
      expect(res0.result).toEqual(expect.objectContaining({ id: 'parse' }));
      expect(res1).toBe(null);
    });

    test('error', () => {
      try {
        Parser.error('error invalid response');
      } catch (e) {
        expect(e.message).toBe('Unexpected response: error invalid response');
      }

      expect.assertions(1);
    });
  });
});

