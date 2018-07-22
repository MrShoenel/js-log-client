const { BaseLogger } = require('./BaseLogger')
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
   * @param {LogLevel} logLevel
   * @param {LogEvent|number} eventId
   * @param {TState} state
   * @param {Error} error
   * @param {(state: TState, error: Error) => string} formatter
   * @returns {this}
   */
  log(logLevel = LogLevel.Information, eventId = 0, state = void 0, error = null, formatter = null) {
    if (this.isEnabled(logLevel)) {
      this._msgQueue.enqueue(new InMemoryLogMessage(
        this.timeString, this.typeString, this.scopeString, logLevel, eventId, state, error, formatter));
      this._numMessagesLogged++;
    }
  };
  
  /**
   * @param {number} order
   * @returns {Array.<InMemoryLogMessage>}
   */
  messagesArray(order = MsgSortOrder.newestFirst) {
    return [...this.messages(order)];
  };

  /**
   * @param {number} order
   * @returns {IterableIterator.<InMemoryLogMessage>}
   */
  messages(order = MsgSortOrder.newestFirst) {
    return order === MsgSortOrder.newestFirst ?
      this._msgQueue.entriesReversed() : this._msgQueue.entries();
  };
};


/**
 * @template T
 */
class InMemoryLogMessage {
  /**
   * @param {string} timeString
   * @param {string} typeString
   * @param {string} scopeString
   * @param {LogLevel} logLevel
   * @param {LogEvent|number} eventId
   * @param {T} state
   * @param {Error} error
   * @param {(state: T, error: Error) => string} formatter
   * @returns {this}
   */
  constructor(timeString, typeString, scopeString, logLevel = LogLevel.Information, eventId = 0, state = void 0, error = null, formatter = null) {
    this.timeString = timeString;
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

    const prefix = timeString === emptyStr && dateString === emptyStr && typeString === emptyStr && scopeString === emptyStr ?
    emptyStr : `${dateString}${(`${dateString === emptyStr ? '' : ' '}`)}${timeString}${(`${timeString === emptyStr ? '' : ' '}${typeString}`)}${scopeString}: `;
    const eventString = this.eventId === 0 || this.eventId.Id === 0 ?
      emptyStr : `(${this.eventId.Id}, ${this.eventId.Name}) `;
    // If state and exception are void 0/null, there is nothing to format.
    // Else, check if there is a formatter and use it. If there is
    // no formatter, call inspect() on the state and append the
    // exception's message, if there is an exception.
    const stateAndExString = this.state === void 0 && this.error === null ? emptyStr :
      (this.formatter instanceof Function ? `${this.formatter(this.state, this.exception)}` :
      (this.state === void 0 ? emptyStr : `${typeof this.state === 'string' ? this.state : inspect(this.state)}` +
      `${(this.error === null ? emptyStr : `, ${this.error.message}`)}`));

    return this._toStringString = `${prefix}${eventString}${stateAndExString}`.trim();
  };
};


module.exports = Object.freeze({
  InMemoryLogger,
  InMemoryLogMessage,
  MsgSortOrder
});
