require('../docs.js');

const LogLevel = require('./LogLevel')
, emptyStr = '';


/**
 * Provides common logging functionality for derived loggers.
 * 
 * @template T the type that uses an instance of this (or a derived) logger.
 * 
 * @author Sebastian Hönel <development@hoenel.net>
 */
class BaseLogger {
  /**
   * @param {T|Function|string} typeOrClassOrCtorFunc The concept behind the logger
   * is that it is type-specific. There are no generics in JavaScript, so you may
   * specify a type by its name or use some context-identifying string.
   */
  constructor(typeOrClassOrCtorFunc) {
    this._type = typeOrClassOrCtorFunc;
    if (typeof typeOrClassOrCtorFunc !== 'function' && typeof typeOrClassOrCtorFunc !== 'string') {
      throw new Error(`The given type, class or constructor is not a string or (constructor-) function: '${JSON.stringify(typeOrClassOrCtorFunc)}'.`);
    }

    this._logLevel = LogLevel.Information;
    this._logCurrentTime = true;
    this._logCurrentType = true;
    this._logCurrentScope = true;
    /** @type {Map.<T, Array.<BaseScope.<any>>>} */
    this._scopeStacks = new Map();
  };

  /**
   * @returns {T|Function}
   */
  get type() {
    return this._type;
  };

  /**
   * @returns {number|LogLevel}
   */
  get logLevel() {
    return this._logLevel;
  };

  /**
   * @param {LogLevel} value
   */
  set logLevel(value) {
    this._logLevel = value;
  };

  /**
   * @returns {Boolean}
   */
  get logCurrentTime() {
    return this._logCurrentTime;
  };

  /**
   * @param {Boolean} value
   */
  set logCurrentTime(value) {
    this._logCurrentTime = !!value;
  };

  /**
   * @returns {Boolean}
   */
  get logCurrentType() {
    return this._logCurrentType;
  };

  /**
   * @param {Boolean} value
   */
  set logCurrentType(value) {
    this._logCurrentType = !!value;
  };

  /**
   * @returns {Boolean}
   */
  get logCurrentScope() {
    return this._logCurrentScope;
  };

  /**
   * @param {Boolean} value
   */
  set logCurrentScope(value) {
    this._logCurrentScope = !!value;
  };

  /**
   * @returns {string} the time in the format HH:mm:ss
   */
  get timeString() {
    return (new Date()).toTimeString().split(' ')[0];
  };

  /**
   * @returns {string}
   */
  get typeString() {
    let tName = null;
    if (typeof this.type === 'string') {
      tName = this.type;
    } else if (typeof this.type === 'function') {
      tName = this.type.name;
    } else {
      throw new Error(`Cannot represent the type of this logger as string.`);
    }
    return `[${tName}]`;
  };

  /**
   * @returns {string}
   */
  get scopeString() {
    if (this._scopeStacks.size === 0) {
      return emptyStr;
    }

    const scopeVals = Array.from(...this._scopeStacks.values());
    return `[${scopeVals.map(scope => scope.toString()).join(', ')}]`;
  };

  /**
   * Returns true, if a {LogLevel} is enabled either explicitly or covered by another,
   * less restrictive LogLevel being in place.
   * 
   * @param {LogLevel} logLevel 
   * @returns {boolean}
   */
  isEnabled(logLevel) {
    return logLevel >= this._logLevel;
  };

  /**
   * @template TState
   * @param {TState} state
   * @returns {BaseScope.<TState>}
   */
  beginScope(state) {
    if (!this._scopeStacks.has(this.type)) {
      this._scopeStacks.set(this.type, []);
    }

    const scope = new BaseScope(state, this);
    this._scopeStacks.get(this.type).push(scope);
    return scope;
  };

  /**
   * @template TState
   * @param {BaseScope.<TState>} scope 
   * @returns {this}
   */
  endScope(scope) {
    if (!this._scopeStacks.has(this.type)) {
      throw new Error(`The given scope is not internally known and may belong to a different logger.`);
    }

    const stack = this._scopeStacks.get(this.type);
    if (stack.length === 0 || stack[stack.length - 1] !== scope) {
      throw new Error(`The given scope is not on top of the stack or the stack is empty.`);
    }

    stack.pop();

    return this;
  };

  /**
   * @template TState
   * @param {TState} state 
   * @param {(this: BaseScope.<TState>, scope: BaseScope.<TState>, logger: BaseLogger.<T>) => void} fn
   * a function that will wrap the scope and automatically dispose it when it finishes
   */
  withScope(state, fn) {
    const scope = this.beginScope(state);

    try {
      fn.apply(scope, [scope, this])
    } finally {
      this.endScope(scope);
    }
  };

  /**
   * @template TState
   * @param {TState} state 
   * @param {(this: BaseScope.<TState>, scope: BaseScope.<TState>, logger: BaseLogger.<T>) => Promise.<void>} asyncFn
   * a function that will wrap the scope and automatically dispose it when it finishes
   */
  async withScopeAsync(state, asyncFn) {
    const scope = this.beginScope(state);

    try {
      await asyncFn.apply(scope, [scope, this]);
    } finally {
      this.endScope(scope);
    }
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
    throw new Error(`Abstract method`);
  };
  
  /**
   * @param {LogLevel} logLevel 
   * @param {string} message
   * @param {Array.<any>} args
   * @returns {this}
   */
  _log(logLevel, message, ...args) {
    return this.log(logLevel, 0, args.length === 0 ? message : [message, ...args]);
  };

  /**
   * @param {string} message
   * @param {Array.<any>} args
   * @returns {this}
   */
  logTrace(message, ...args) {
    return this._log(LogLevel.Trace, message, ...args);
  };

  /**
   * @param {string} message
   * @param {Array.<any>} args
   * @returns {this}
   */
  logDebug(message, ...args) {
    return this._log(LogLevel.Debug, message, ...args);
  };

  /**
   * @param {string} message
   * @param {Array.<any>} args
   * @returns {this}
   */
  logInfo(message, ...args) {
    return this._log(LogLevel.Information, message, ...args);
  };

  /**
   * @param {string} message
   * @param {Array.<any>} args
   * @returns {this}
   */
  logWarning(message, ...args) {
    return this._log(LogLevel.Warning, message, ...args);
  };

  /**
   * @param {string} message
   * @param {Array.<any>} args
   * @returns {this}
   */
  logError(message, ...args) {
    return this._log(LogLevel.Error, message, ...args);
  };

  /**
   * @param {string} message
   * @param {Array.<any>} args
   * @returns {this}
   */
  logCritical(message, ...args) {
    return this._log(LogLevel.Critical, message, ...args);
  };

  /**
   * So that Object.prototype.toString.call(new BaseLogger()) results in [object BaseLogger].
   * 
   * @returns {string}
   */
  get [Symbol.toStringTag] () {
    return `${this.constructor.name}<${this.typeString}>`;
  };
};


/**
 * @template T
 * 
 * @author Sebastian Hönel <development@hoenel.net>
 */
class BaseScope {
  /**
   * 
   * @param {T} scopeValue 
   * @param {BaseLogger.<T>} logger 
   */
  constructor(scopeValue, logger) {
    this._scopeValue = scopeValue;
    this._logger = logger;
  };

  /**
   * @returns {T}
   */
  get scopeValue() {
    return this._scopeValue;
  };

  /**
   * @returns {string}
   */
  toString() {
    if (this.scopeValue === void 0) {
      return emptyStr;
    } else if (typeof this.scopeValue === 'string') {
      return this.scopeValue;
    } else if (typeof this.scopeValue.toString === 'function') {
      return this.scopeValue.toString();
    }

    return JSON.stringify(this.scopeValue);
  };

  /**
   * So that Object.prototype.toString.call(new BaseScope()) results in [object BaseScope].
   * 
   * @returns {string}
   */
  get [Symbol.toStringTag] () {
    return this.constructor.name;
  };
};

module.exports = Object.freeze({
  BaseLogger,
  BaseScope
});
