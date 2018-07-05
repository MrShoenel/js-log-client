/**
 * @typedef TransportMethod
 * @type {object}
 * @property {'http'|'console'} type 'http'(s) is supported through HttpTransport and 'console'
 */

/**
 * @typedef {TransportMethod} HttpTransport
 * @property {string} endpoint
 */

/**
 * @typedef TransportConf
 * @type {object}
 * @property {TransportMethod|HttpTransport} method
 */


/**
 * @typedef LogConf
 * @type {object}
 * @property {TransportConf} transport
 */


/**
 * @typedef LogEvent
 * @type {object}
 * @property {number} id
 * @property {string} name
 */


/**
 * @typedef LogObject
 * @type {object}
 * @property {LogLevel} logLevel
 * @property {LogEvent|number} eventId
 * @property {any} state
 * @property {Error|string} error
 */


/**
 * @typedef {number} LogLevel
 */

/**
 * Enum for the log-level. The same as Microsoft.Extensions.Logging.LogLevel.
 * @readonly
 * @enum {LogLevel}
 */
const LogLevel = {
  Trace: 0,
  Debug: 1,
  Information: 2,
  Warning: 3,
  Error: 4,
  Critical: 5,
  None: 6
};
