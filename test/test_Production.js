const { assert } = require('chai')
, {
  LogLevel,
  BaseLogger, BaseScope, BaseLogEvent,
  symbolBeginScope, symboleEndScope, symbolMessageLogged,
  symbolBeforeLogMessage, symbolAfterLogMessage,
  defaultErrorFormatter, defaultEventFormatter,
  defaultFormatter, defaultValueFormatter,
  ColoredConsoleLogger,
  DevNullLogger,
  InMemoryLogger, InMemoryLogMessage, MsgSortOrder,
  DualLogger,
  WrappedLogger,
  StreamLogger,
  LoggerPipe
} = require('../index')
, { timeout } = require('sh.orchestration-tools');


describe('Suite to test that the loggers do not throw', function() {
  it('should not throw when logging', async() => {
    const b = new BaseLogger(StreamLogger);
    assert.strictEqual(b.typeString, `[${StreamLogger.name}]`);

    assert.throws(() => {
      b.log(LogLevel.Error, 0, 'foo');
    }, /Abstract method/i);

    b.withScope(42, function(sc, log) {
      assert.isTrue(this instanceof BaseScope);
      assert.isTrue(sc === this);
      assert.strictEqual(sc.scopeValue, 42);
    });

    await b.withScopeAsync(43, async function(sc, log) {
      assert.isTrue(this instanceof BaseScope);
      assert.isTrue(sc === this);
      assert.strictEqual(sc.scopeValue, 43);

      await new Promise((res, _) => res());
    });

    assert.strictEqual(b.numMessagesLogged, 0);
    assert.strictEqual(b.logLevel, LogLevel.Information);
    
    assert.doesNotThrow(() => {
      const x = `${b.logCurrentDate}${b.logCurrentScope}${b.logCurrentTime}${b.logCurrentType}`;
      x.toString();
    });
  });

  it('should not throw when using the default formatters', done => {
    assert.doesNotThrow(() => {
      defaultErrorFormatter();
      defaultErrorFormatter(42);
      defaultErrorFormatter(null);
      defaultErrorFormatter(true);
      defaultErrorFormatter(new Error());
      defaultErrorFormatter({});
    });

    assert.doesNotThrow(() => {
      defaultEventFormatter();
      defaultEventFormatter(42);
      defaultEventFormatter(null);
      defaultEventFormatter(true);
      defaultEventFormatter(new Error());
      defaultEventFormatter({});
    });

    assert.doesNotThrow(() => {
      defaultValueFormatter();
      defaultValueFormatter(42);
      defaultValueFormatter(null);
      defaultValueFormatter(true);
      defaultValueFormatter(new Error());
      defaultValueFormatter({});
    });

    assert.doesNotThrow(() => {
      defaultFormatter();
      defaultFormatter(42);
      defaultFormatter(null);
      defaultFormatter(true);
      defaultFormatter(new Error());
      defaultFormatter({});

      defaultFormatter(void 0);
      defaultFormatter(void 0, 42);
      defaultFormatter(void 0, null);
      defaultFormatter(void 0, true);
      defaultFormatter(void 0, new Error());
      defaultFormatter(void 0, {});

      defaultFormatter(void 0, void 0);
      defaultFormatter(42, 42);
      defaultFormatter(null, null);
      defaultFormatter(false, true);
      defaultFormatter(Date, new Error());
      defaultFormatter({}, {});
    });

    done();
  });

  it('should not throw in our derived loggers', done => {
    const ccl = new ColoredConsoleLogger('CCL')
    , dnl = new DevNullLogger('DNL')
    , dualL = new DualLogger('DUAL', ccl, dnl)
    , inm = new InMemoryLogger('INM', 1)
    , str = StreamLogger.createFromOneStream('STDERR', process.stderr)
    , wra = new WrappedLogger(inm, str);

    assert.doesNotThrow(() => {
      dualL.logTrace('trace');
      dualL.logError('error', 1, true);
      dualL.logInfo(void 0, {});
      dualL.logWarning('warn', {}, new Error, 'foo');
      dualL.logDebug('debug');
      dualL.logCritical();
      
      wra.logTrace('trace');
      wra.logError('error', 1, true);
      wra.logInfo(void 0, {});
      wra.logWarning('warn', {}, new Error, 'foo', [void 0, null]);
      wra.logDebug('debug');
      wra.withScope('SCOPE', () => {
        wra.log(LogLevel.Information, { bla: false }, 'state 42');
      });
    });

    done();
  });

  it('should pipe to an encapsulated logger', async() => {
    const inm = new InMemoryLogger('Foo')
    , str = new LoggerPipe(inm);

    const r = new (require('stream').Readable)();
    r.pipe(str);
    r.push('42');
    r.push(null);

    await timeout(50);
    assert.strictEqual(inm.numMessagesLogged, 1);
  });
});
