import type { ContextBridgeApi } from '../src-electron/electron-preload';

declare global {
  interface Window {
    api: ContextBridgeApi;
  }
}
