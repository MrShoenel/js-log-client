require('../docs.js');

const { BaseLogger } = require('./BaseLogger')
, LogLevel = require('./LogLevel')
, Chalk = require('chalk')
, emptyStr = '';




/**
 * @type {ConsoleLogConf}
 */
const ConsoleConfDefault = {
  useLog: new Set(Array.of(
    LogLevel.Warning,
    LogLevel.Debug,
    LogLevel.Trace,
  )),
  useError: new Set(Array.of(
    LogLevel.Critical,
    LogLevel.Error
  )),
  useInfo: new Set(Array.of(
    LogLevel.Information
  ))
};



/**
 * @template T
 */
class ColoredConsoleLogger extends BaseLogger {
  /**
   * Returns the default configuration.
   * 
   * @see ConsoleConfDefault
   * @returns {ConsoleLogConf}
   */
  static get defaultConsoleConf() {
    return ConsoleConfDefault;
  };

  /**
   * @param {T|Function|string} typeOrClassOrCtorFunc The concept behind the logger
   * is that it is type-specific. There are no generics in JavaScript, so you may
   * specify a type by its name or use some context-identifying string.
   * @param {ConsoleLogConf} stdOutErrConf
   */
  constructor(typeOrClassOrCtorFunc, stdOutErrConf) {
    super(typeOrClassOrCtorFunc);
    this._stdOutErrConf = this._validateStdConf(stdOutErrConf);
  };

  /**
   * @returns {ConsoleLogConf}
   */
  get consoleConf() {
    return this._stdOutErrConf;
  };

  /**
   * 
   * @param {ConsoleLogConf} conf
   * @returns {ConsoleLogConf}
   */
  _validateStdConf(conf) {
    // TODO: Implement this
    return conf;
  };

  /**
   * @param {LogLevel} logLevel
   * @returns {null|((message?: any, ...optionalParams: Array.<any>) => void)}
   */
  _getStreamForLogLevel(logLevel) {
    const conf = this.consoleConf;
    if (conf.useLog.has(logLevel)) {
      return console.log;
    } else if (conf.useError.has(logLevel)) {
      return console.error;
    } else if (conf.useInfo.has(logLevel)) {
      return console.info;
    }
    return null;
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
    if (!this.isEnabled(logLevel)) {
      return; // We're not logging this
    }

    const logMethod = this._getStreamForLogLevel(logLevel);
    if (logMethod === null) {
      return; // This loglevel is not to be logged to any stream
    }

    const timeString = this.logCurrentTime ? this.timeString : emptyStr
    , typeString = this.logCurrentType ? this.typeString : emptyStr
    , scopeString = this.logCurrentScope ? this.scopeString : emptyStr;

    const wholeString = ''; // TODO

    switch (logLevel) {
      case LogLevel.Trace:
        logMethod(Chalk.gray(wholeString));
        break;

        // TODO: Add other cases and colors
    }
  };

  /*
  public override void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, String> formatter)
		{
			// cyan, green, white, magenta, red, yellow
			if (!this.IsEnabled(logLevel))
			{
				return; // We're not logging this
			}

			var timeString = this.LogCurrentTime ? this.TimeString : String.Empty;
			var typeString = this.LogCurrentType ? this.TypeString : String.Empty;
			var scopeString = this.LogCurrentScope ? this.ScopeString : String.Empty;

			var prefix = timeString == String.Empty && typeString == String.Empty && scopeString == String.Empty ?
				String.Empty : $"{timeString}{typeString}{scopeString}: ";
			var eventString = eventId.Id == 0 ? String.Empty : $"({ eventId.Id }, { eventId.Name }) ";
			// If state and exception are null, there is nothing to format.
			// Else, check if there is a formatter and use it. If there is
			// no formatter, call ToString() on the state and append the
			// exception's message, if there is an exception.
			var stateAndExString = state == null && exception == null ? String.Empty :
				(formatter is Func<TState, Exception, String> ? $"{ formatter(state, exception) }" :
				(state == null ? String.Empty : $"{ state.ToString() }, " +
				$"{ (exception == null ? String.Empty : exception.Message) }"));

			var wholeLogString = $"{prefix}{eventString}{stateAndExString}".Trim();

			using (var colorScope = CC.WithColorScope())
			{
				// Crit, Debug, Err, info, none, trace, warn
				switch (logLevel)
				{
					case LogLevel.Trace:
						CC.GrayLine(wholeLogString);
						break;
					case LogLevel.Debug:
						CC.GreenLine(wholeLogString);
						break;
					case LogLevel.Information:
						CC.WhiteLine(wholeLogString);
						break;
					case LogLevel.Warning:
						CC.YellowLine(wholeLogString);
						break;
					case LogLevel.Error:
						CC.RedLine(wholeLogString);
						break;
					case LogLevel.Critical:
						CC.MagentaLine(wholeLogString);
						break;
				}
			}
		} */

};


module.exports = Object.freeze({
  ColoredConsoleLogger
});