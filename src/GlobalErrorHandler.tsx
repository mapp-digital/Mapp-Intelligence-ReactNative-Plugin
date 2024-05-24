import { trackException } from './index';
// import {
//   getUnhandledPromiseRejectionTracker,
//   setUnhandledPromiseRejectionTracker,
// } from './promiseRejectionHandler';
const {
  polyfillGlobal,
} = require('react-native/Libraries/Utilities/PolyfillFunctions');
const Promise = require('promise/setimmediate/es6-extensions');
const tracking = require('promise/setimmediate/rejection-tracking');

export type GlobalErrorHandler = (
  error: any,
  isFatal: boolean | undefined
) => void;

var onErrorCallback: ((e: Error, isFatal: Boolean) => {}) | undefined | null =
  null;

const defaultErrorHandler: GlobalErrorHandler = (error, isFatal) => {
  try {
    trackException(error, error.stackTrace);
    console.log('GLOBAL ERROR HANDLER: ', isFatal, error);
  } catch (err) {
    console.error(err);
  } finally {
    onErrorCallback?.(error, isFatal ?? false);
  }
};

export const setGlobalErrorHandler = (
  errorCallback?: ((e: Error, isFatal: Boolean) => {}) | undefined | null,
  errorHandler: GlobalErrorHandler = defaultErrorHandler
): void => {
  onErrorCallback = errorCallback;

  polyfillGlobal('Promise', () => {
    tracking.enable({
      allRejections: true,
      onUnhandled: (_: number, error: unknown) => {
        errorHandler(error, false);
      },
    });

    return Promise;
  });

  ErrorUtils.setGlobalHandler(errorHandler);
  //   const prevTracker = getUnhandledPromiseRejectionTracker();

  //   setUnhandledPromiseRejectionTracker((id: any, error: any) => {
  //     console.warn('Unhandled promise rejection!', id, error);
  //     if (prevTracker !== undefined) {
  //       //prevTracker(id, error);
  //       errorHandler(error, false);
  //     }
  //   });
};
