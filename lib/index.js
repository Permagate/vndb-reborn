const crypto = require('crypto');
const debug = require('debug')('vndb');
const tls = require('tls');

const builder = require('./builder');
const parser = require('./parser');

module.exports = { start };

const VNDB_CONN_INFO = {
  host: 'api.vndb.org',
  port: 19535,
};

// Used to indicate that the message is complete
const TERMINATOR = '\u0004';

function start (host = VNDB_CONN_INFO.host, port = VNDB_CONN_INFO.port) {
  return _connect(host, port).then(socket => {
    const postman = _summonPostman(socket);
    const postmanSafeWrite = (message) =>
      postman.write(message).then(response => {
        const vndbError = parser.error(response);
        if (vndbError) {
          const error = new Error(vndbError.msg);
          error.detail = vndbError;
          throw error;
        }

        return response;
      });

    return {
      socket,
      write: postman.write.bind(postman),
      login (data) {
        const message = builder.login(data);
        return postmanSafeWrite(message).then(parser.login);
      },
      dbstats () {
        const message = builder.dbstats();
        return postmanSafeWrite(message).then(parser.dbstats);
      },
      get (data) {
        const message = builder.get(data);
        return postmanSafeWrite(message).then(parser.get);
      },
      set (data) {
        const message = builder.set(data);
        return postmanSafeWrite(message).then(parser.set);
      },
      end () {
        return new Promise((resolve, reject) => {
          socket.end();

          socket.removeAllListeners('error');
          socket.once('error', e => {
            debug(`${socket.id} - ended with error - ${e}`);
            reject(e);
          });

          socket.once('end', () => {
            debug(`${socket.id} - ended`);
            resolve();
          });
        });
      },
    };
  });
}

function _connect (host, port) {
  return new Promise((resolve, reject) => {
    // Unique id to identify socket
    const id = crypto.randomBytes(12).toString('base64');
    debug(`${id} - connecting to ${host}:${port}`);

    const socket = tls.connect({ host, port }, () => {
      debug(`${id} - connected`);
      socket.removeAllListeners('error');
      resolve(socket);
    });

    socket.once('error', e => {
      debug(`${id} - failed to connect - ${e}`);
      reject(e);
    });

    socket.id = id;
    socket.setEncoding('utf8');
  });
}

/**
 * Greetings, I'm Mr. Postman.
 * I'm here to manage all your message sending needs.
 *
 * In particular, I make sure that only 1 message is being sent to destination.
 * And that message is successfully replied before I send another.
 *
 * But Mr. Postman,
 *   Can we send a new message without waiting the old message?
 *   Can we send multiple messages at once?
 *
 * Fear not, I have a message box to hold all pending messages.
 * So sooner or later, I'll definitely send them all.
 */
function _summonPostman (socket) {
  const messageBox = [];
  let isWaitingReply = false;

  return {
    write (message) {
      const promise = _createDeferredPromise();
      messageBox.push({ message, promise });
      debug(`${socket.id} - message queued - ${message}`);
      this.checkMessageBox();
      return promise;
    },

    checkMessageBox () {
      if (!isWaitingReply) {
        const nextTask = messageBox.shift();
        if (nextTask) {
          isWaitingReply = true;
          debug(`${socket.id} - sending message - ${nextTask.message}`);
          socket.write(_format(nextTask.message));

          let bufferedReply = '';
          socket.removeAllListeners('data');
          socket.on('data', data => {
            bufferedReply += data;
            if (bufferedReply[bufferedReply.length - 1] === TERMINATOR) {
              const withoutTerminator = bufferedReply.slice(0, -1);
              debug(`${socket.id} - receiving reply - ${withoutTerminator}`);
              nextTask.promise.resolve(withoutTerminator);
              isWaitingReply = false;
              this.checkMessageBox();
            }
          });

          socket.removeAllListeners('error');
          socket.on('error', e => {
            debug(`${socket.id} - unexpected error - ${nextTask.message} - ${e}`);
            nextTask.promise.reject(e);
          });
        }
      }
    },
  };
}

function _createDeferredPromise () {
  // Utility function to create a deferred promise
  let resolve;
  let reject;

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  promise.resolve = resolve;
  promise.reject = reject;

  return promise;
}

function _format (outgoingMessage) {
  return `${outgoingMessage}\u0004`;
}

