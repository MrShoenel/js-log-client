const LogLevel = require('./LogLevel')
, { BaseLogger, symbolBeforeLogMessage, symbolAfterLogMessage } = require('./BaseLogger')
, { DualLogger } = require('./DualLogger');


/**
 * Extends the DualLogger and wraps an original logger by duplicating its
 * settings and properties to another copy logger. All properties have been
 * overridden so they are set on this logger, the original and the copy. The
 * scopes on the WrappedLogger are functional and replicated to both other
 * loggers. The WrappedLogger mimics the original logger's type.
 * 
 * @template TLogger1, TLogger2
 */
class WrappedLogger extends DualLogger {
  /**
   * Initializes a new WrappedLogger that mimics the given original logger by
   * replicating all of its properties to itself and the copy-logger. To change
   * a setting/property, it needs to be set on the WrappedLogger, as only that
   * will propagate the setting to the original- and copy-logger. Modifying any
   * of these manually will not be propagated to the respective other or the
   * WrappedLogger itself.
   * 
   * @param {BaseLogger.<TLogger1>} originalLogger
   * @param {BaseLogger.<TLogger2>} copyLogger
   */
  constructor(originalLogger, copyLogger) {
    super(copyLogger._type = originalLogger.type, originalLogger, copyLogger);

    this.logLevel = originalLogger.logLevel;
    this.logCurrentTime = originalLogger.logCurrentTime;
    this.logCurrentDate = originalLogger.logCurrentDate;
    this.logCurrentType = originalLogger.logCurrentType;
    this.logCurrentScope = originalLogger.logCurrentScope;
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
    this.emit(symbolBeforeLogMessage, new BaseLogEvent(this));

    try {
      // We have to set this up every time immediately before calling log(),
      // to avoid race-conditions when logging async with the same instance
      // of the original- or  copy-logger.
      this.logger2._scopeStacks = this.logger1._scopeStacks = this._scopeStacks;

      // The setters below are necessary in a scenario where the SAME logger
      // (logger2) is given to various clients (e.g. returning a WrappedLogger
      // with a genuine logger1 (original) and always the same instance for
      // logger2 (copy-logger)). In that case, when logging on the WrappedLogger,
      // logger2 needs to reflect the most recent/current context.
      this.logger2._type = this.type;
      this.logger2.logLevel = this.logLevel;
      this.logger2.logCurrentTime = this.logCurrentTime;
      this.logger2.logCurrentDate = this.logCurrentDate;
      this.logger2.logCurrentType = this.logCurrentType;
      this.logger2.logCurrentScope = this.logCurrentScope;

      return super.log(logLevel, eventId, state, error, formatter);
    } finally {
      this.emit(symbolAfterLogMessage, new BaseLogEvent(this));
    }
  };

  /**
   * @param {LogLevel} value
   */
  set logLevel(value) {
    super.logLevel = this.logger1.logLevel = this.logger2.logLevel = value;
  };

  /**
   * @returns {number|LogLevel}
   */
  get logLevel() {
    return super.logLevel;
  };

  /**
   * @param {boolean} value
   */
  set logCurrentTime(value) {
    super.logCurrentTime = this.logger1.logCurrentTime = this.logger2.logCurrentTime = !!value;
  };

  /**
   * @returns {Boolean}
   */
  get logCurrentTime() {
    return super.logCurrentTime;
  };

  /**
   * @param {boolean} value
   */
  set logCurrentDate(value) {
    super.logCurrentDate = this.logger1.logCurrentDate = this.logger2.logCurrentDate = !! value;
  };

  /**
   * @returns {Boolean}
   */
  get logCurrentDate() {
    return super.logCurrentDate;
  };

  /**
   * @param {boolean} value
   */
  set logCurrentType(value) {
    super.logCurrentType = this.logger1.logCurrentType = this.logger2.logCurrentType = !!value;
  };

  /**
   * @returns {Boolean}
   */
  get logCurrentType() {
    return super.logCurrentType;
  };

  /**
   * @param {boolean} value
   */
  set logCurrentScope(value) {
    super.logCurrentScope = this.logger1.logCurrentScope = this.logger2.logCurrentScope = !!value;
  };

  /**
   * @returns {Boolean}
   */
  get logCurrentScope() {
    return super.logCurrentScope;
  };
};


module.exports = Object.freeze({
  WrappedLogger
});
