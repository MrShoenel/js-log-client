require('../docs.js');
const LogLevel = require('./LogLevel')
, Transporter = require('./Transporter');

module.exports = class BaseLogger {
  /**
   * @param {Transporter} transporter
   * @param {string} type The concept behind the logger is that it is type-specific.
   * There are no generics in JavaScript, so you may specify a type by its name or
   * use some context-identifying string.
   * @param {LogLevel} logLevel
   */
  constructor(transporter, type = null, logLevel = LogLevel.Information) {
    this.transporter = transporter;
    this.type = null;
    this.level = logLevel;
  };

  set logLevel(logLevel = LogLevel.Information) {
    this.level = logLevel;
  };

  get logLevel() {
    return this.level;
  };

  /**
   * Returns true, if a {LogLevel} is enabled either explicitly or covered by another,
   * less restrictive LogLevel being in place.
   * @param {LogLevel} logLevel 
   * @returns {boolean}
   */
  isEnabled(logLevel) {
    return logLevel >= this.level;
  };

  /**
   * @param {LogLevel} logLevel
   * @param {LogEvent|number} eventId
   * @param {any} state
   * @param {Error} error
   * @param {(state: any, error: Error) => string} formatter
   * @returns {Promise.<any>}
   */
  log(logLevel = LogLevel.Information, eventId = 0, state = void 0, error = null, formatter = null) {
    if (!this.isEnabled(logLevel)) {
      return; // We're not logging this
    }

    return this.transporter.transport({
      logLevel,
      eventId,
      error: formatter instanceof Function ? formatter(state, error) : error,
      state: formatter instanceof Function ? formatter(state, error) : state
    });
  };

  _log(logLevel, message, ...args) {
    return this.log(logLevel, 0, JSON.stringify(args));
  };

  /**
   * @param {string} message
   * @param {any[]} args
   * @returns {Promise.<any>}
   */
  logTrace(message, ...args) {
    return this._log(LogLevel.Trace, message, ...args);
  };

  /**
   * @param {string} message
   * @param {any[]} args
   * @returns {Promise.<any>}
   */
  logDebug(message, ...args) {
    return this._log(LogLevel.Debug, message, ...args);
  };

  /**
   * @param {string} message
   * @param {any[]} args
   * @returns {Promise.<any>}
   */
  logInfo(message, ...args) {
    return this._log(LogLevel.Information, message, ...args);
  };

  /**
   * @param {string} message
   * @param {any[]} args
   * @returns {Promise.<any>}
   */
  logWarning(message, ...args) {
    return this._log(LogLevel.Warning, message, ...args);
  };

  /**
   * @param {string} message
   * @param {any[]} args
   * @returns {Promise.<any>}
   */
  logError(message, ...args) {
    return this._log(LogLevel.Error, message, ...args);
  };

  /**
   * @param {string} message
   * @param {any[]} args
   * @returns {Promise.<any>}
   */
  logCritical(message, ...args) {
    return this._log(LogLevel.Critical, message, ...args);
  };
};
