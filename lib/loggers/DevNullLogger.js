require('../../docs.js');

const { BaseLogger, BaseLogEvent, symbolMessageLogged, symbolBeforeLogMessage, symbolAfterLogMessage } = require('./BaseLogger')
, LogLevel = require('./LogLevel');


/**
 * @template T
 * 
 * @author Sebastian Hönel <development@hoenel.net>
 * 
 * The DevNullLogger is a dummy-logger that discards any messages logged to it and is
 * always enabled (i.e. it cannot be disabled).
 */
class DevNullLogger extends BaseLogger {
  /**
   * @param {T|Function|string} [typeOrClassOrCtorFunc] Optional. Defaults to an empty
   * string. The concept behind the logger is that it is type-specific. There are no
   * generics in JavaScript, so you may specify a type by its name or use some context-
   * identifying string.
   */
  constructor(typeOrClassOrCtorFunc = '') {
    super(typeOrClassOrCtorFunc);
  };

  /**
   * Any message logged through this method is discarded entirely. No action is
   * taken at all (i.e. the message is thrown away).
   * 
   * @template TState
   * @inheritDoc
   * @param {LogLevel} [logLevel]
   * @param {LogEvent|number} [eventId]
   * @param {TState} [state]
   * @param {Error} [error]
   * @param {(state: TState, error: Error) => string} for[matter
   * @returns {this}
   */
  log(logLevel = LogLevel.Information, eventId = 0, state = void 0, error = null, formatter = null) {
    this.emit(symbolBeforeLogMessage, new BaseLogEvent(this, null, ...arguments));

    try {
      if (this.isEnabled(logLevel)) {
        this._numMessagesLogged++;
        this.emit(symbolMessageLogged,
          new BaseLogEvent(this, null, logLevel, eventId, state, error, formatter));
      }
      return this;
    } finally {
      this.emit(symbolAfterLogMessage, new BaseLogEvent(this));
    }
  };
};


module.exports = Object.freeze({
  DevNullLogger
});
