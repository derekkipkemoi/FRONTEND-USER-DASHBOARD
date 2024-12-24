if (process.env.REACT_APP_ENVIRONMENT === 'PROD') {
  const noop = (): void => {};
  globalThis.console.log = noop;
  globalThis.console.warn = noop;
  globalThis.console.error = noop;
  globalThis.console.info = noop;
  globalThis.console.debug = noop;
}
