const { BaseLogger, BaseLogEvent, symbolMessageLogged, defaultEventFormatter, symbolBeforeLogMessage, symbolAfterLogMessage } = require('./BaseLogger')
, { ConstrainedQueue } = require('sh.orchestration-tools')
, { inspect } = require('util');


const MsgSortOrder = Object.freeze({
  oldestFirst: 1,
  newestFirst: 2
});

const emptyStr = '';


/**
 * @template T
 */
class InMemoryLogger extends BaseLogger {
  /**
   * @param {T|Function|string} [typeOrClassOrCtorFunc] Optional. Defaults to an empty
   * string. The concept behind the logger is that it is type-specific. There are no
   * generics in JavaScript, so you may specify a type by its name or use some context-
   * identifying string.
   * @param {number} [capacity] Optional. Defaults to 1000. The amount of logged messages
   * to keep in memory. This is a FiFo-queue.
   */
  constructor(typeOrClassOrCtorFunc = '', capacity = 1000) {
    super(typeOrClassOrCtorFunc);
    /** @type {ConstrainedQueue.<InMemoryLogMessage>} */
    this._msgQueue = new ConstrainedQueue(capacity);
  };

  /**
   * @param {number} value The new capacity for logged messages kept in memory. If the
   * value is less than the current amount of messages, excess messages will be discarded
   * (oldest first).
   * @throws {Error} If the value is not a number or out of range (i.e. not accepted by
   * the underlying ConstrainedQueue).
   */
  set capacity(value) {
    this._msgQueue.maxSize = value;
  };

  /**
   * @returns {number} The maximum amount of log messages this logger can store in memory.
   */
  get capacity() {
    return this._msgQueue.maxSize;
  };

  /**
   * @returns {number} The current amount of log messages stored in my memory by this logger.
   */
  get numMessages() {
    return this._msgQueue.size;
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
    if (this.isEnabled(logLevel)) {
      const msg = new InMemoryLogMessage(
        this.timeString, this.dateString, this.typeString, this.scopeString,
        logLevel, formatter || this.formatter, eventId, state, error);
      
      this._msgQueue.enqueue(msg);
      this._numMessagesLogged++;
      this.emit(symbolMessageLogged, new BaseLogEvent(this, null, msg));
    }

    return this;
  } finally {
    this.emit(symbolAfterLogMessage, new BaseLogEvent(this));}
  };
  
  /**
   * @param {number} order
   * @returns {Array.<InMemoryLogMessage.<*>>}
   */
  messagesArray(order = MsgSortOrder.newestFirst) {
    return [...this.messages(order)];
  };

  /**
   * @param {number} order
   * @returns {IterableIterator.<InMemoryLogMessage.<*>>}
   */
  messages(order = MsgSortOrder.newestFirst) {
    return order === MsgSortOrder.newestFirst ?
      this._msgQueue.entriesReversed() : this._msgQueue.entries();
  };

  /**
   * @param {number} order
   * @param {null|((msg: InMemoryLogMessage.<*>) => boolean)} filter
   * @returns {IterableIterator.<InMemoryLogMessage.<*>>}
   */
  *messagesFiltered(order = MsgSortOrder.newestFirst, filter = null) {
    filter = filter === null ? _ => true : filter;
    
    const it = this.messages(order);
    for (const msg of it) {
      if (filter(msg)) {
        yield msg;
      }
    }
  };
};


/**
 * @template T
 */
class InMemoryLogMessage {
  /**
   * @param {string} timeString
   * @param {string} dateString
   * @param {string} typeString
   * @param {string} scopeString
   * @param {LogLevel} logLevel
   * @param {(state: T, error: Error) => string} formatter
   * @param {LogEvent|number} [eventId]
   * @param {T} [state]
   * @param {Error} [error]
   */
  constructor(timeString, dateString, typeString, scopeString, logLevel = LogLevel.Information, formatter, eventId = 0, state = void 0, error = null) {
    this.timeString = timeString;
    this.dateString = dateString;
    this.typeString = typeString;
    this.scopeString = scopeString;

    this.logLevel = logLevel;
    this.eventId = eventId;
    this.state = state;
    this.error = error;
    this.formatter = formatter;

    this._toStringString = null;
  };

  /**
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  };

  /**
   * Clears the buffered formatted message returned from toString(). This method needs
   * to be called if the message is modified after toString() has been called and the
   * changes need to be reflected.
   * 
   * @see {toString()}
   * @returns {this}
   */
  clearToString() {
    this._toStringString = null;
    return this;
  };

  /**
   * @see {clearToString()}
   * @returns {string} A formatted message as string. This method buffers the generated
   * string so that subsequent changes to this log message will not be reflected in it.
   * The buffered message however can be cleared using clearToString().
   */
  toString() {
    if (this._toStringString !== null) {
      return this._toStringString;
    }

    const eventString = defaultEventFormatter(this.eventId)
    , prefix = this.timeString === emptyStr && this.dateString === emptyStr && this.typeString === emptyStr && this.scopeString === emptyStr ?
    emptyStr : `${this.dateString}${(`${this.dateString === emptyStr ? emptyStr : ' '}`)}${this.timeString}${(`${this.timeString === emptyStr ? emptyStr : ' '}${this.typeString}`)}${this.scopeString}${eventString === emptyStr ? emptyStr : `[E:${eventString}]`}: `
    , stateAndExString = this.formatter(this.state, this.error);

    return this._toStringString = `${prefix}${stateAndExString}`.trim();
  };
};


module.exports = Object.freeze({
  InMemoryLogger,
  InMemoryLogMessage,
  MsgSortOrder
});
