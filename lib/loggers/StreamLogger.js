const LogLevel = require('./LogLevel')
, { BaseLogger, BaseLogEvent, symbolBeforeLogMessage, symbolAfterLogMessage, defaultEventFormatter } = require('./BaseLogger')
, { Writable } = require('stream')
, emptyStr = '';



/**
 * @template T
 */
class StreamLogger extends BaseLogger {
  /**
   * @param {T|Function|string} typeOrClassOrCtorFunc The concept behind the logger
   * is that it is type-specific. There are no generics in JavaScript, so you may
   * specify a type by its name or use some context-identifying string.
   * @param {Map.<LogLevel|number, Writable>} streamConf A map where each LogLevel
   * corresponds to a stream. Each key-value pair however may point at the same stream.
   */
  constructor(typeOrClassOrCtorFunc, streamConf) {
    super(typeOrClassOrCtorFunc);
    this._streams = streamConf;
  };

  /**
   * @returns {Map.<LogLevel, Writable>}
   */
  get streamConf() {
    return this._streams;
  };

  /**
   * @param {Map.<LogLevel, Writable>} value
   */
  set streamConf(value) {
    this._streams = value;
  };

  /**
   * @template TLogger
   * @param {TLogger|Function|string} typeOrClassOrCtorFunc The concept behind the
   * logger is that it is type-specific. There are no generics in JavaScript, so
   * you may specify a type by its name or use some context-identifying string.
   * @param {Writable} stream The stream to write all messages to (i.e. for each
   * log level, the same stream is used).
   * @returns {StreamLogger.<TLogger>}
   */
  static createFromOneStream(typeOrClassOrCtorFunc, stream) {
    const map = new Map();
    Object.keys(LogLevel).forEach(k => map.set(LogLevel[k], stream));
    return new StreamLogger(typeOrClassOrCtorFunc, map);
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
      const timeString = this.logCurrentTime ? this.timeString : emptyStr
      , dateString = this.logCurrentDate ? this.dateString : emptyStr
      , typeString = this.logCurrentType ? this.typeString : emptyStr
      , scopeString = this.logCurrentScope ? this.scopeString : emptyStr;
      
      const eventString = defaultEventFormatter(eventId)
      , prefix = timeString === emptyStr && dateString === emptyStr && typeString === emptyStr && scopeString === emptyStr ?
        emptyStr : `${dateString}${(`${dateString === emptyStr ? emptyStr : ' '}`)}${timeString}${(`${timeString === emptyStr ? emptyStr : ' '}${typeString}`)}${scopeString}${eventString === emptyStr ? emptyStr : `[E:${eventString}]`}: `
      , stateAndExString = (formatter || this.formatter)(state, error)
      , wholeLogString = `${prefix}${stateAndExString}`.trim() + "\n";

      const str = this.streamConf.get(logLevel);
      str.cork();
      str.write(wholeLogString, 'utf8');
      str.uncork();
    } finally {
      this.emit(symbolAfterLogMessage, new BaseLogEvent(this));
    }
  };
};


module.exports = Object.freeze({
  StreamLogger
});
