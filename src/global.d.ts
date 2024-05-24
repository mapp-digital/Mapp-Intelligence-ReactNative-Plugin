// src/global.d.ts
declare global {
  interface GlobalEventHandlersEventMap {
    onunhandledrejection: PromiseRejectionEvent;
  }

  interface PromiseRejectionEvent extends Event {
    promise: Promise<any>;
    reason: any;
  }

  interface Global {
    onununhandledrejection?: (event: PromiseRejectionEvent) => void;
  }

  const global: Global;
}

type Tracker = (id: number, error: unknown) => void;

export function getUnhandledPromiseRejectionTracker(): Tracker | undefined;
export function setUnhandledPromiseRejectionTracker(tracker: Tracker): void;

export {};
