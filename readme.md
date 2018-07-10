# LogClient
LogClient (or: `log-client`) is a universal module for nodejs or JavaScript applications in general for distributed logging using various transport methods. The concept of this logger is based on `Microsoft.Extensions.Logging`.

## Install via npm
`npm install sh.log-client`

## Breaking changes since version 2.0.0
The `log-client` is supposed to be a functionally equivalent implementation of the logging functionalities found in `util-dotnet` (https://github.com/MrShoenel/util-dotnet).
The concept of `Transporter`s has been removed entirely.
