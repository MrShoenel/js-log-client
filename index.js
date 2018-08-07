require('./docs.js');


const LogLevel = require('./Logging/LogLevel')
, { BaseLogger, BaseScope, BaseLogEvent,
  symbolBeginScope, symboleEndScope, symbolMessageLogged } = require('./Logging/BaseLogger')
, { ColoredConsoleLogger} = require('./Logging/ColoredConsoleLogger')
, { DevNullLogger } = require('./Logging/DevNullLogger')
, { InMemoryLogger, InMemoryLogMessage, MsgSortOrder } = require('./Logging/InMemoryLogger')
, { DualLogger } = require('./Logging/DualLogger')
, { WrappedLogger } = require('./Logging/WrappedLogger');


module.exports = Object.freeze({
  LogLevel,
  BaseLogger, BaseScope, BaseLogEvent,
  symbolBeginScope, symboleEndScope, symbolMessageLogged,
  ColoredConsoleLogger,
  DevNullLogger,
  InMemoryLogger, InMemoryLogMessage, MsgSortOrder,
  DualLogger,
  WrappedLogger
});
