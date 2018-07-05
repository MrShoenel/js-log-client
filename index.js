require('./docs.js');

const LogLevel = require('./Logging/LogLevel')
, BaseLogger = require('./Logging/BaseLogger')
, { Transporter } = require('./Logging/Transporter')
, { ConsoleTransporter } = require('./Logging/ConsoleTransporter');

module.exports = {
  LogLevel,
  BaseLogger,
  Transporter,
  ConsoleTransporter
};
