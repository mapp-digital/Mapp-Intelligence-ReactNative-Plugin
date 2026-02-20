'use strict';

const Promise = require('promise/setimmediate/es6-extensions');

require('promise/setimmediate/done');
require('promise/setimmediate/finally');

const tracking = require('promise/setimmediate/rejection-tracking');

//@ts-ignore
const defaultHandler = (id, error) => {
  error = error === undefined ? {} : error;
  let message;
  let stack;

  const stringValue = Object.prototype.toString.call(error);
  if (stringValue === '[object Error]') {
    message = Error.prototype.toString.call(error);
    stack = error.stack;
  } else {
    try {
      message = require('pretty-format')(error);
    } catch {
      message = typeof error === 'string' ? error : JSON.stringify(error);
    }
  }

  const warning =
    `Possible Unhandled Promise Rejection (id: ${id}):\n` +
    `${message}\n` +
    (stack == null ? '' : stack);
  console.warn(warning);
};

let handler = defaultHandler;

export const getUnhandledPromiseRejectionTracker = () => handler;

//@ts-ignore
export const setUnhandledPromiseRejectionTracker = (tracker) => {
  handler = tracker;

  tracking.enable({
    allRejections: true,
    onUnhandled: tracker,
  });

  (global as any).Promise = Promise;
};
