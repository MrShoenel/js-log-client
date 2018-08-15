const { Writable } = require('stream')
, { BaseLogger } = require('../loggers/BaseLogger');


/**
 * @template T
 * 
 * @author Sebastian Hönel <development@hoenel.net>
 */
class LoggerPipe extends Writable {
  /**
   * @param {BaseLogger.<T>} logger
   * @param {string|'utf8'} [encoding] Optional. Defaults to 'utf8'. The encoding
   * to use if Buffers are written to this pipe.
   */
  constructor(logger, encoding = 'utf8') {
    super();
    this._logger = logger;
    this._encoding = encoding;
  };

  /**
   * @param {Buffer|string|any} chunk 
   * @param {string} encoding 
   * @param {(err: Error) => void} [callback]
   */
  _write(chunk, encoding, callback) {
    callback = callback instanceof Function ? callback : (e) => {};

    const msg = typeof chunk === 'string' ? chunk :
      (chunk instanceof Buffer ? chunk.toString(this._encoding) : chunk);

    try {
      this._logger.log(this._logger.logLevel, 0, msg);
      callback();
    } catch (e) {
      callback(e);
    }
  };
};


module.exports = Object.freeze({
  LoggerPipe
});
