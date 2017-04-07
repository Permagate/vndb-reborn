/* eslint-env jest */
const Builder = require('../lib/builder');

describe('Query Builder', () => {
  describe('login', () => {
    test('ok', () => {
      const res0 = Builder.login({
        client: 'VNDB-Reborn-Tester',
        clientver: '0.0.1',
      });

      expect(res0).toEqual(expect.stringContaining('"client":"VNDB-Reborn-Tester"'));
      expect(res0).toEqual(expect.stringContaining('"clientver":"0.0.1"'));

      const res1 = Builder.login({
        client: 'VNDB-Reborn-Tester',
        clientver: '0.0.1',
        username: 'tester_user',
        password: 'tester_pass',
      });

      expect(res1).toEqual(expect.stringContaining('"client":"VNDB-Reborn-Tester"'));
      expect(res1).toEqual(expect.stringContaining('"clientver":"0.0.1"'));
      expect(res1).toEqual(expect.stringContaining('"username":"tester_user"'));
      expect(res1).toEqual(expect.stringContaining('"password":"tester_pass"'));
    });

    test('error - incomplete argument', () => {
      try {
        Builder.login();
      } catch (e) {
        expect(e.message).toBe('Login command is missing body argument.');
      }

      expect.assertions(1);
    });

    test('error - invalid argument', () => {
      try {
        Builder.login('body pls');
      } catch (e) {
        expect(e.message).toBe('Login command has non-object body argument.');
      }

      expect.assertions(1);
    });
  });

  describe('dbstats', () => {
    test('ok', () => {
      const res0 = Builder.dbstats();

      expect(res0).toBe('dbstats');
    });
  });

  describe('get', () => {
    test('ok', () => {
      const res0 = Builder.get({
        type: 'vn',
        flags: 'basic,anime',
        filters: '(id = 17)',
      });

      expect(res0).toBe('get vn basic,anime (id = 17)');

      const res1 = Builder.get({
        type: 'vn',
        flags: 'basic, anime',
        filters: '(id = 17)',
      });

      expect(res1).toBe('get vn basic,anime (id = 17)');

      const res2 = Builder.get({
        type: 'vn',
        flags: ['basic', 'anime'],
        filters: '(id = 17)',
      });

      expect(res2).toBe('get vn basic,anime (id = 17)');

      const res3 = Builder.get({
        type: 'vn',
        flags: 'basic,anime',
        filters: 'id = 17',
      });

      expect(res3).toBe('get vn basic,anime (id = 17)');

      const res4 = Builder.get({
        type: 'vn',
        flags: 'basic,anime',
        filters: '(id = 17)',
        options: {},
      });

      expect(res4).toBe('get vn basic,anime (id = 17)');

      const res5 = Builder.get({
        type: 'vn',
        flags: 'basic,anime',
        filters: '(id = 17)',
        options: {
          page: 2,
          results: 10,
          sort: 'id',
          reverse: true,
        },
      });

      expect(res5).toEqual(expect.stringContaining('get vn basic,anime (id = 17)'));
      expect(res5).toEqual(expect.stringContaining('"page":2'));
      expect(res5).toEqual(expect.stringContaining('"results":10'));
      expect(res5).toEqual(expect.stringContaining('"sort":"id"'));
      expect(res5).toEqual(expect.stringContaining('"reverse":true'));
    });

    test('error - incomplete argument', () => {
      try {
        Builder.get({});
      } catch (e) {
        expect(e.message).toBe('Get command is missing type, flags, filters argument(s).');
      }

      try {
        Builder.get({
          type: 'vn',
          flags: 'basic,anime',
        });
      } catch (e) {
        expect(e.message).toBe('Get command is missing filters argument(s).');
      }

      try {
        Builder.get({
          type: 'vn',
          filters: '(id = 17)',
        });
      } catch (e) {
        expect(e.message).toBe('Get command is missing flags argument(s).');
      }

      try {
        Builder.get({
          flags: 'basic,anime',
          filters: '(id = 17)',
        });
      } catch (e) {
        expect(e.message).toBe('Get command is missing type argument(s).');
      }

      expect.assertions(4);
    });

    test('error - invalid argument', () => {
      try {
        Builder.get();
      } catch (e) {
        expect(e.message).toBe('Get command has non-object argument.');
      }

      try {
        Builder.get({
          type: 'vn',
          flags: 'basic,anime',
          filters: '(id = 17)',
          options: 'body pls',
        });
      } catch (e) {
        expect(e.message).toBe('Get command has non-object options argument.');
      }

      expect.assertions(2);
    });
  });

  describe('set', () => {
    test('ok', () => {
      const res0 = Builder.set({
        type: 'votelist',
        id: 17,
        fields: {
          vote: 88,
        },
      });

      expect(res0).toBe('set votelist 17 {"vote":88}');
    });

    test('error - incomplete argument', () => {
      try {
        Builder.set({
          id: 17,
          fields: {
            vote: 88,
          },
        });
      } catch (e) {
        expect(e.message).toBe('Set command is missing type argument(s).');
      }

      try {
        Builder.set({
          type: 'votelist',
          fields: {
            vote: 88,
          },
        });
      } catch (e) {
        expect(e.message).toBe('Set command is missing id argument(s).');
      }

      try {
        Builder.set({
          type: 'votelist',
          id: 17,
        });
      } catch (e) {
        expect(e.message).toBe('Set command is missing fields argument(s).');
      }

      try {
        Builder.set({});
      } catch (e) {
        expect(e.message).toBe('Set command is missing type, id, fields argument(s).');
      }

      expect.assertions(4);
    });

    test('error - invalid argument', () => {
      try {
        Builder.set('body pls');
      } catch (e) {
        expect(e.message).toBe('Set command has non-object argument.');
      }

      try {
        Builder.set({
          type: 'votelist',
          id: 17,
          fields: 'body pls',
        });
      } catch (e) {
        expect(e.message).toBe('Set command has non-object fields argument.');
      }

      expect.assertions(2);
    });
  });
});

