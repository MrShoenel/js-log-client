require('./docs.js');


const LogLevel = require('./Logging/LogLevel')
, { BaseLogger, BaseScope } = require('./Logging/BaseLogger')
, { ColoredConsoleLogger} = require('./Logging/ColoredConsoleLogger')
, { DevNullLogger } = require('./Logging/DevNullLogger')
, { InMemoryLogger, InMemoryLogMessage, MsgSortOrder } = require('./Logging/InMemoryLogger')
, { DualLogger } = require('./Logging/DualLogger')
, { WrappedLogger } = require('./Logging/WrappedLogger');


module.exports = Object.freeze({
  LogLevel,
  BaseLogger, BaseScope,
  ColoredConsoleLogger,
  DevNullLogger,
  InMemoryLogger, InMemoryLogMessage, MsgSortOrder,
  DualLogger,
  WrappedLogger
});
