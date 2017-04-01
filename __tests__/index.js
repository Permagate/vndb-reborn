/* eslint-env jest */
const VNDB = require('../lib');

// Real test against VNDB API
// So we need to make sue that the timeout interval is big enough
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000; // eslint-disable-line

describe('Raw', () => {
  test('ok', async () => {
    const vndb = await VNDB.start();
    const res0 = await vndb.write('login {"protocol":1,"client":"VNDB-Reborn-Tester","clientver":"0.0.1"}');
    const res1 = await vndb.write('dbstats');
    const res2 = await vndb.write('get vn basic,anime (id = 17)');
    const res3 = await vndb.write('invalid command');
    await vndb.end();

    expect(vndb.socket).toBeTruthy();
    expect(res0).toBe('ok');
    expect(res1).toEqual(expect.stringMatching(/^dbstats {.+}/));
    expect(res2).toEqual(expect.stringMatching(/^results {.+Ever17.+}/));
    expect(res3).toEqual(expect.stringMatching(/^error {.+parse.+}/));
    expect(vndb.socket.destroyed).toBe(true);
  });

  test('ok - multiple messages', async () => {
    const vndb = await VNDB.start();
    const res0 = await vndb.write('login {"protocol":1,"client":"VNDB-Reborn-Tester","clientver":"0.0.1"}');
    const res1 = await Promise.all([
      vndb.write('dbstats'),
      vndb.write('get vn basic,anime (id = 17)'),
      vndb.write('invalid command'),
    ]);
    await vndb.end();

    expect(vndb.socket).toBeTruthy();
    expect(res0).toBe('ok');
    expect(res1[0]).toEqual(expect.stringMatching(/^dbstats {.+}/));
    expect(res1[1]).toEqual(expect.stringMatching(/^results {.+Ever17.+}/));
    expect(res1[2]).toEqual(expect.stringMatching(/^error {.+parse.+}/));
    expect(vndb.socket.destroyed).toBe(true);
  });

  test('error - invalid url', async () => {
    expect.assertions(1);
    try {
      await VNDB.start('api-invalid-url.vndb.org');
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  test('error - invalid port', async () => {
    expect.assertions(1);
    try {
      await VNDB.start('api.vndb.org', 19534);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});

