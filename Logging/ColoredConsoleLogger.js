require('../docs.js');

const { BaseLogger } = require('./BaseLogger')
, LogLevel = require('./LogLevel')
, Chalk = require('chalk')
, util = require('util')
, emptyStr = '';




/**
 * @type {ConsoleLogConf}
 * 
 * @author Sebastian Hönel <development@hoenel.net>
 */
const ConsoleConfDefault = {
  useLog: new Set(Array.of(
    LogLevel.Warning,
    LogLevel.Debug,
    LogLevel.Trace,
  )),
  useError: new Set(Array.of(
    LogLevel.Critical,
    LogLevel.Error
  )),
  useInfo: new Set(Array.of(
    LogLevel.Information
  ))
};



/**
 * @template T
 * 
 * @author Sebastian Hönel <development@hoenel.net>
 */
class ColoredConsoleLogger extends BaseLogger {
  /**
   * Returns the default configuration.
   * 
   * @see ConsoleConfDefault
   * @returns {ConsoleLogConf}
   */
  static get defaultConsoleConf() {
    return ConsoleConfDefault;
  };

  /**
   * @param {T|Function|string} typeOrClassOrCtorFunc The concept behind the logger
   * is that it is type-specific. There are no generics in JavaScript, so you may
   * specify a type by its name or use some context-identifying string.
   * @param {ConsoleLogConf} consoleConf
   */
  constructor(typeOrClassOrCtorFunc, consoleConf = void 0) {
    super(typeOrClassOrCtorFunc);
    this._stdOutErrConf = consoleConf === void 0 ?
      ColoredConsoleLogger.defaultConsoleConf : this._validateConsoleConf(consoleConf);
  };

  /**
   * @returns {ConsoleLogConf}
   */
  get consoleConf() {
    return this._stdOutErrConf;
  };

  /**
   * @param {ConsoleLogConf} conf
   * @throws {Error} if the configuration's properties are not sets
   * @returns {ConsoleLogConf}
   */
  _validateConsoleConf(conf) {
    if (!conf) {
      throw new Error('The given configuration is not valid.');
    }

    const ho = p => Object.hasOwnProperty.call(conf, p);

    ['useLog', 'useInfo', 'useError'].forEach(prop => {
      if (ho(prop)) {
        if (!(conf[prop] instanceof Set)) {
          throw new Error(`Property '${prop}' of the configuration is not a Set!`);
        }
      } else {
        conf[prop] = new Set();
      }
    });
    
    return conf;
  };

  /**
   * @param {LogLevel} logLevel
   * @returns {null|((message?: any, ...optionalParams: Array.<any>) => void)}
   */
  _getStreamForLogLevel(logLevel) {
    const conf = this.consoleConf;
    if (conf.useLog.has(logLevel)) {
      return console.log;
    } else if (conf.useError.has(logLevel)) {
      return console.error;
    } else if (conf.useInfo.has(logLevel)) {
      return console.info;
    }
    return null;
  };

  /**
   * @template TState
   * @param {LogLevel} logLevel
   * @param {LogEvent|number} eventId
   * @param {TState} state
   * @param {Error} error
   * @param {(state: TState, error: Error) => string} formatter
   * @returns {this}
   */
  log(logLevel = LogLevel.Information, eventId = 0, state = void 0, error = null, formatter = null) {
    if (!this.isEnabled(logLevel)) {
      return; // We're not logging this
    }

    this._numMessagesLogged++;

    const logMethod = this._getStreamForLogLevel(logLevel);
    if (logMethod === null) {
      return; // This loglevel is not to be logged to any stream
    }

    const timeString = this.logCurrentTime ? this.timeString : emptyStr
    , dateString = this.logCurrentDate ? this.dateString : emptyStr
    , typeString = this.logCurrentType ? this.typeString : emptyStr
    , scopeString = this.logCurrentScope ? this.scopeString : emptyStr;
    
    const prefix = timeString === emptyStr && dateString === emptyStr && typeString === emptyStr && scopeString === emptyStr ?
      emptyStr : `${dateString}${(`${dateString === emptyStr ? '' : ' '}`)}${timeString}${(`${timeString === emptyStr ? '' : ' '}${typeString}`)}${scopeString}: `;
    const eventString = eventId === 0 || eventId.Id === 0 ?
      emptyStr : `(${eventId.Id}, ${eventId.Name}) `;
    // If state and exception are void 0/null, there is nothing to format.
    // Else, check if there is a formatter and use it. If there is
    // no formatter, call util.inspect() on the state and append the
    // exception's message, if there is an exception.
    const stateAndExString = state === void 0 && error === null ? emptyStr :
      (formatter instanceof Function ? `${formatter(state, exception)}` :
      (state === void 0 ? emptyStr : `${typeof state === 'string' ? state : util.inspect(state)}` +
      `${(error === null ? emptyStr : `, ${error.message}`)}`));

    const wholeLogString = `${prefix}${eventString}${stateAndExString}`.trim();

    switch (logLevel) {
      case LogLevel.Trace:
        logMethod(Chalk.gray(wholeLogString));
        break;
      case LogLevel.Debug:
        logMethod(Chalk.green(wholeLogString));
        break;
      case LogLevel.Information:
        logMethod(Chalk.white(wholeLogString));
        break;
      case LogLevel.Warning:
        logMethod(Chalk.yellow(wholeLogString));
        break;
      case LogLevel.Error:
        logMethod(Chalk.red(wholeLogString));
        break;
      case LogLevel.Critical:
        logMethod(Chalk.magenta(wholeLogString));
        break;
    }
  };
};


module.exports = Object.freeze({
  ColoredConsoleLogger
});