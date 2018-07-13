# LogClient
LogClient (or: `log-client`) is a universal module for nodejs or JavaScript applications in general for distributed logging using various transport methods. The concept of this logger is based on `Microsoft.Extensions.Logging`.

## Install via npm
`npm install sh.log-client`

## Included Loggers
Currently, this client includes the following loggers:
* __`BaseLogger<T>`__ the abstract base-class for all loggers that includes neccessary functionality, only having its `log()`-method abstract.
  * __`BaseScope<T>`__ the base-class for scopes
* __`ColoredConsoleLogger<T>`__ a logger that outputs to the console's streams (info, warning, error) and is configurable w.r.t. to which level should be logged to which stream. Also supports colors.
* __`DevNullLogger<T>`__ a dummy logger that discards all messages and is always enabled

## Write and contribute your own Loggers
Writing an own logger is as simple as extending `BaseLogger<T>`. Please, submit a _pull-request_ if you want to contribute your own logger to this repository.


## Breaking changes since version 2.0.0
The `log-client` is supposed to be a functionally equivalent implementation of the logging functionalities found in `util-dotnet` (https://github.com/MrShoenel/util-dotnet).
The concept of `Transporter`s has been removed entirely.
