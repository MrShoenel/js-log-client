require('./docs.js');

const LogLevel = require('./Logging/LogLevel')
, { BaseLogger, BaseScope } = require('./Logging/BaseLogger')
, { ColoredConsoleLogger} = require('./Logging/ColoredConsoleLogger');


module.exports = Object.freeze({
  LogLevel,
  BaseLogger,
  BaseScope,
  ColoredConsoleLogger
});
