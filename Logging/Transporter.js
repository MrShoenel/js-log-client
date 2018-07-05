require('../docs.js');

const reqProm = require('request-promise');

/**
 * @author Sebastian Hönel <development@hoenel.net>
 */
class Transporter {
  /**
   * 
   * @param {TransportConf|HttpTransport} conf 
   */
  constructor(conf) {
    this.conf = Object.freeze(conf);
  };

  /**
   * Transports the logging object using the configured transport.
   * 
   * @param {LogObject} logObj 
   * @returns {void}
   */
  async transport(logObj) {
    if (this.conf.method.type === 'http') {
      return this._transportHttp(logObj);
    }

    return Promise.reject(`The configured transport method "${this.conf.type}" is not supported.`);
  };

  /**
   * Private method that implements HTTP(s) transport via POST.
   * @param {LogObject} logObj
   * @returns {Promise.<any>}
   */
  _transportHttp(logObj) {
    return reqProm.post(this.conf.method.endpoint, {
      json: logObj
    });
  };
};

module.exports = Object.freeze({
  Transporter
});
