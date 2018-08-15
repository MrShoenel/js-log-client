require('./docs.js');


const LogLevel = require('./lib/loggers/LogLevel')
, { BaseLogger, BaseScope, BaseLogEvent,
  symbolBeginScope, symboleEndScope, symbolMessageLogged,
  symbolBeforeLogMessage, symbolAfterLogMessage,
  defaultErrorFormatter, defaultEventFormatter,
  defaultFormatter, defaultValueFormatter } = require('./lib/loggers/BaseLogger')
, { ColoredConsoleLogger} = require('./lib/loggers/ColoredConsoleLogger')
, { DevNullLogger } = require('./lib/loggers/DevNullLogger')
, { InMemoryLogger, InMemoryLogMessage, MsgSortOrder } = require('./lib/loggers/InMemoryLogger')
, { DualLogger } = require('./lib/loggers/DualLogger')
, { WrappedLogger } = require('./lib/loggers/WrappedLogger')
, { StreamLogger } = require('./lib/loggers/StreamLogger')
, { LoggerPipe } = require('./lib/extra/LoggerPipe')


module.exports = Object.freeze({
  LogLevel,
  BaseLogger, BaseScope, BaseLogEvent,
  symbolBeginScope, symboleEndScope,
  /**
   * This symbol is emitted using a BaseLogEvent. The BaseLogEvent will
   * always have its scope then set to null. Its arguments may be set
   * specific to the emitting logger's implementation for log().
   */
  symbolMessageLogged,
  /**
   * This symbol is emitted using a BaseLogEvent. The BaseLogEvent will
   * always have its scope then set to null and its arguments array set
   * to the arguments as passed to the log()-method.
   * @type {Symbol}
   */
  symbolBeforeLogMessage,
  /**
   * This symbol is emitted using a BaseLogEvent. The BaseLogEvent will
   * always have its scope then set to null and its arguments to an empty
   * array.
   */
  symbolAfterLogMessage,
  defaultErrorFormatter, defaultEventFormatter,
  defaultFormatter, defaultValueFormatter,
  ColoredConsoleLogger,
  DevNullLogger,
  InMemoryLogger, InMemoryLogMessage, MsgSortOrder,
  DualLogger,
  WrappedLogger,
  StreamLogger,
  LoggerPipe
});
