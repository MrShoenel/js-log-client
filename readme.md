# LogClient
LogClient (or: `log-client`) is a universal module for nodejs or JavaScript applications in general for distributed logging using various transport methods. The concept of this logger is based on `Microsoft.Extensions.Logging`.

## Transport methods
* HTTP(s): Currently, messages can be logged using http(s) to a distant server.
* Console: Uses `console.error`, `info` or `warn` based on the log level

## Install via npm
`npm install sh.log-client`
