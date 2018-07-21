const { BaseLogger } = require('./BaseLogger');


/**
 * This class is a logger that logs messages to two other loggers. More precisely,
 * logged messages are forwarded to both loggers, without being logged by this class
 * in any way. This class is helpful for scenarios where log messages need to be sent
 * to two different sinks (i.e. to a local console and to a remote server). It is
 * perfectly fine to construct a whole graph of loggers, by using one or two dual-
 * loggers as child loggers.
 * 
 * @template T
 */
class DualLogger extends BaseLogger {
  /**
   * @template TLogger1, TLogger2
   * @param {T|Function|string} typeOrClassOrCtorFunc The concept behind the logger
   * is that it is type-specific. There are no generics in JavaScript, so you may
   * specify a type by its name or use some context-identifying string.
   * @param {BaseLogger.<TLogger1>} logger1
   * @param {BaseLogger.<TLogger2>} logger2
   */
  constructor(typeOrClassOrCtorFunc, logger1, logger2) {
    super(typeOrClassOrCtorFunc);
    this.logger1 = logger1;
    this.logger2 = logger2;
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
    this.logger1.log(logLevel, eventId, state, error, formatter);
    this.logger2.log(logLevel, eventId, state, error, formatter);
  };
};


module.exports = Object.freeze({
  DualLogger
});
