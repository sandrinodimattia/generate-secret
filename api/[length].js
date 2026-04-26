const { send } = require('micro');
const { promisify } = require('util');
const { randomBytes } = require('crypto');

const randomBytesAsync = promisify(randomBytes);
const MAX_LENGTH = 512;

module.exports = async (req, res) => {
  const length = parseInt(req.query && req.query.length);
  if (!length) {
    res.statusCode = 301;
    res.setHeader('Location', `/32`);
    res.end();
    return;
  }
  if (length > MAX_LENGTH) {
    send(res, 400, `Secret length must not exceed ${MAX_LENGTH}.`);
    return;
  }

  const randomString = (await randomBytesAsync(Math.ceil(length/2)))
    .toString('hex')
    .slice(0,length);
  send(res, 200, randomString);
}
