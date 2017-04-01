module.exports = { hello };

async function hello () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Hello World');
    }, 100);
  });
}

