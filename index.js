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
, { StreamLogger } = require('./lib/loggers/StreamLogger');


module.exports = Object.freeze({
  LogLevel,
  BaseLogger, BaseScope, BaseLogEvent,
  symbolBeginScope, symboleEndScope, symbolMessageLogged,
  symbolBeforeLogMessage, symbolAfterLogMessage,
  defaultErrorFormatter, defaultEventFormatter,
  defaultFormatter, defaultValueFormatter,
  ColoredConsoleLogger,
  DevNullLogger,
  InMemoryLogger, InMemoryLogMessage, MsgSortOrder,
  DualLogger,
  WrappedLogger,
  StreamLogger
});
