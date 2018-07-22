const LogLevel = require('./LogLevel')
, { BaseLogger } = require('./BaseLogger')
, { DualLogger } = require('./DualLogger');


/**
 * Extends the DualLogger and wraps an original logger by duplicating its
 * settings and properties to another copy logger. All properties have been
 * overridden so they are set on this logger, the original and the copy. The
 * scopes on the WrappedLogger are functional and replicated to both other
 * loggers. The WrappedLogger mimics the original logger's type.
 * 
 * @template T
 */
class WrappedLogger extends DualLogger {
  /**
   * @template TLogger1, TLogger2
   * @param {BaseLogger.<TLogger1>} originalLogger
   * @param {BaseLogger.<TLogger2>} copyLogger
   */
  constructor(originalLogger, copyLogger) {
    super(originalLogger.type, originalLogger, copyLogger);
    
    copyLogger._type = originalLogger.type;
    originalLogger._scopeStacks = copyLogger._scopeStacks = this._scopeStacks;

    this.logLevel = originalLogger.logLevel;
    this.logCurrentTime = originalLogger.logCurrentTime;
    this.logCurrentType = originalLogger.logCurrentType;
    this.logCurrentScope = originalLogger.logCurrentScope;
  };

  /**
   * @param {LogLevel} value
   */
  set logLevel(value) {
    super.logLevel = this.logger1.logLevel = this.logger2.logLevel = value;
  };

  /**
   * @param {boolean} value
   */
  set logCurrentTime(value) {
    super.logCurrentTime = this.logger1.logCurrentTime = this.logger2.logCurrentTime = !!value;
  };

  /**
   * @param {boolean} value
   */
  set logCurrentType(value) {
    super.logCurrentType = this.logger1.logCurrentType = this.logger2.logCurrentType = !!value;
  };

  /**
   * @param {boolean} value
   */
  set logCurrentScope(value) {
    this.
    super.logCurrentScope = this.logger1.logCurrentScope = this.logger2.logCurrentScope = !!value;
  };
};


module.exports = Object.freeze({
  WrappedLogger
});
