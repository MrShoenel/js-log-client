require('../../docs.js');

const { BaseLogger, BaseLogEvent, symbolMessageLogged,
  defaultEventFormatter, symbolBeforeLogMessage, symbolAfterLogMessage
} = require('./BaseLogger')
, LogLevel = require('./LogLevel')
, Chalk = require('chalk')
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
   * @inheritDoc
   * @param {LogLevel} [logLevel]
   * @param {LogEvent|number} [eventId]
   * @param {TState} [state]
   * @param {Error} [error]
   * @param {(state: TState, error: Error) => string} [formatter]
   * @returns {this}
   */
  log(logLevel = LogLevel.Information, eventId = 0, state = void 0, error = null, formatter = null) {
    this.emit(symbolBeforeLogMessage, new BaseLogEvent(this, null, ...arguments));

    try {
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
      
      const eventString = defaultEventFormatter(eventId)
      , prefix = timeString === emptyStr && dateString === emptyStr && typeString === emptyStr && scopeString === emptyStr ?
        emptyStr : `${dateString}${(`${dateString === emptyStr ? emptyStr : ' '}`)}${timeString}${(`${timeString === emptyStr ? emptyStr : ' '}${typeString}`)}${scopeString}${eventString === emptyStr ? emptyStr : `[E:${eventString}]`}: `
      , stateAndExString = (formatter || this.formatter)(state, error)
      , wholeLogString = `${prefix}${stateAndExString}`.trim();

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
      
      this.emit(symbolMessageLogged, new BaseLogEvent(this, null, wholeLogString));
      return this;
    } finally {
      this.emit(symbolAfterLogMessage, new BaseLogEvent(this));
    }
  };
};


module.exports = Object.freeze({
  ColoredConsoleLogger
});