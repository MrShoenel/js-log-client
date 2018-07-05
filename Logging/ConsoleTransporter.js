require('../docs.js');

const { Transporter } = require('./Transporter')
, LogLevel = require('./LogLevel');


class ConsoleTransporter extends Transporter {
  constructor() {
    super({method: 'console'});
  };

  /**
   * @param {LogObject} logObj 
   */
  transport(logObj) {
    let logFn = console.log;
    if (logObj.logLevel >= LogLevel.Error) {
      logFn = console.error;
    } else if (logObj.logLevel === LogLevel.Warning) {
      logFn = console.warn;
    }

    logFn(`${logObj.eventId !== 0 ? `(${logObj.eventId}) ` : ''}${logObj.state}${logObj.error}`);
  };
};

module.exports = Object.freeze({
  ConsoleTransporter
});
