# LogClient
LogClient (or: `log-client`) is a universal module for nodejs or JavaScript applications in general for distributed logging using various transport methods. The concept of this logger is based on `Microsoft.Extensions.Logging`.

## Install via npm <span style="vertical-align:middle">[![Current Version](https://img.shields.io/npm/v/sh.log-client.svg)](https://www.npmjs.com/package/sh.log-client)</span>
`npm install sh.log-client`

## Included Loggers
Currently, this client includes the following loggers:
* __`BaseLogger<T>`__ the abstract base-class for all loggers that includes neccessary functionality, only having its `log()`-method abstract.
  * __`BaseScope<T>`__ the base-class for scopes
* __`ColoredConsoleLogger<T>`__ a logger that outputs to the console's streams (info, warning, error) and is configurable w.r.t. to which level should be logged to which stream. Also supports colors.
* __`DevNullLogger<T>`__ a dummy logger that discards all messages and is always enabled
* __`InMemoryLogger<T>`__ and __`InMemoryLogMessage<T>`__ a logger and its message to store log messages in memory. Supports specifying a maximum capacity so that only the newest messages are kept.
* __`DualLogger<T, TLog1, TLog2>`__ a logger that forwards all logging-calls to two other loggers without modifying them.
* __`WrappedLogger<TLog1, TLog2>`__ a logger that wraps and mimics an original logger (`TLog1`) and also forwards any logging calls to a 2nd copy-logger (`TLog2`). This is an extension to the *DualLogger*.
* __`StreamLogger<T>`__ a logger that writes messages to a `Writable`-stream. Supports different streams per log level.

## Write and contribute your own Loggers
Writing an own logger is as simple as extending `BaseLogger<T>`. Please, submit a _pull-request_ if you want to contribute your own logger to this repository.


## Breaking changes since version 2.0.0
The `log-client` is supposed to be a functionally equivalent implementation of the logging functionalities found in `util-dotnet` (https://github.com/MrShoenel/util-dotnet).
The concept of `Transporter`s has been removed entirely.
