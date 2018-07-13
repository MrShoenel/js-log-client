require('./docs.js');

const LogLevel = require('./Logging/LogLevel')
, { BaseLogger, BaseScope } = require('./Logging/BaseLogger')
, { ColoredConsoleLogger} = require('./Logging/ColoredConsoleLogger')
, { DevNullLogger } = require('./Logging/DevNullLogger');


module.exports = Object.freeze({
  LogLevel,
  BaseLogger,
  BaseScope,
  ColoredConsoleLogger,
  DevNullLogger
});
