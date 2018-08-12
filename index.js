require('./docs.js');


const LogLevel = require('./Logging/LogLevel')
, { BaseLogger, BaseScope, BaseLogEvent,
  symbolBeginScope, symboleEndScope, symbolMessageLogged,
  symbolBeforeLogMessage, symbolAfterLogMessage,
  defaultErrorFormatter, defaultEventFormatter,
  defaultFormatter, defaultValueFormatter } = require('./Logging/BaseLogger')
, { ColoredConsoleLogger} = require('./Logging/ColoredConsoleLogger')
, { DevNullLogger } = require('./Logging/DevNullLogger')
, { InMemoryLogger, InMemoryLogMessage, MsgSortOrder } = require('./Logging/InMemoryLogger')
, { DualLogger } = require('./Logging/DualLogger')
, { WrappedLogger } = require('./Logging/WrappedLogger');


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
  WrappedLogger
});
