# VNDB Reborn

A simple node.js wrapper for VNDB API. Reference: [https://vndb.org/d11](https://vndb.org/d11).

## Installation

```bash
$ npm install vndb
```

## Usage

`VNDB` exposes an object that contains only a single function `.start([host], [port])`. This is an asynchronous function that tries to connect to VNDB API.

```js
const VNDB = require('vndb');

(async () => {
  try {
    const vndb = await VNDB.start();
    console.log('Connected!');
  } catch (e) {
    console.log('Something happened when connecting to VNDB API');
  }
})();
```

You can pass in host/port optionally. This is not required 99% of the times, unless VNDB changes host/port.

```js
const vndb = await VNDB.start('myvndb.com', 1234);
```

The start function itself returns an object that contains the socket and 2 convenient methods to interact with it.

* `vndb.write(message)`

Write a raw message to VNDB API. Specification should follow [https://vndb.org/d11]([https://vndb.org/d11]). This function will add terminator and queue the message accordingly, as one socket can only send/receive one message at a time.

```js
const vndb = await VNDB.start();
const res0 = await vndb.write('login {"protocol":1,"client":"VNDB-Reborn-Tester","clientver":"0.0.1"}');
const res1 = await vndb.write('dbstats');
const res2 = await vndb.write('get vn basic,anime (id = 17)');
```

* `vndb.end()`

End the socket connection. Can be await-ed if you want to make sure that it really ends.

```js
const vndb = await VNDB.start();
const res0 = await vndb.write('login {"protocol":1,"client":"VNDB-Reborn-Tester","clientver":"0.0.1"}');
await vndb.end();
```

* `vndb.socket`

The socket object, an instance of native `tls.TLSSocket`.

## Debugging

[debug module](https://www.npmjs.com/package/debug) is included and used for debugging purpose, under `vndb` namespace.

```bash
DEBUG=vndb node index.js
```

