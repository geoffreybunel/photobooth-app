// External store for the browser's fullscreen state (can change outside our control,
// e.g. the user presses Esc), read via useSyncExternalStore rather than an effect.

type Listener = () => void;

let listeners: Listener[] = [];

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeToFullscreen(callback: Listener): () => void {
  listeners.push(callback);
  if (listeners.length === 1) {
    document.addEventListener("fullscreenchange", notify);
  }

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    if (listeners.length === 0) {
      document.removeEventListener("fullscreenchange", notify);
    }
  };
}

export function getFullscreenSnapshot(): boolean {
  return document.fullscreenElement !== null;
}

export function getFullscreenServerSnapshot(): boolean {
  return false;
}

export function enterFullscreen(element: HTMLElement) {
  element.requestFullscreen?.();
}

export function exitFullscreen() {
  document.exitFullscreen?.();
}
