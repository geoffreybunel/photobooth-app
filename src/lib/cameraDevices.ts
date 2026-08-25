// External store for available camera devices, meant to be read via useSyncExternalStore.
// Device labels are blank until getUserMedia grants permission once, and the list can
// change at any time (a webcam plugged/unplugged) — both are exactly what an external
// store + the browser's own `devicechange` event are for, rather than an effect that
// calls setState directly.

type Listener = () => void;

const EMPTY_DEVICES: MediaDeviceInfo[] = [];

let cachedDevices: MediaDeviceInfo[] = EMPTY_DEVICES;
let listeners: Listener[] = [];
let refreshing: Promise<void> | null = null;

function notify() {
  listeners.forEach((listener) => listener());
}

function refresh(): Promise<void> {
  if (!refreshing) {
    refreshing = navigator.mediaDevices
      .enumerateDevices()
      .then((all) => {
        cachedDevices = all.filter((d) => d.kind === "videoinput");
        notify();
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export function subscribeToCameraDevices(callback: Listener): () => void {
  listeners.push(callback);
  if (listeners.length === 1) {
    navigator.mediaDevices.addEventListener("devicechange", refresh);
  }
  refresh();

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    if (listeners.length === 0) {
      navigator.mediaDevices.removeEventListener("devicechange", refresh);
    }
  };
}

export function getCameraDevicesSnapshot(): MediaDeviceInfo[] {
  return cachedDevices;
}

export function getCameraDevicesServerSnapshot(): MediaDeviceInfo[] {
  return EMPTY_DEVICES;
}

// Labels are empty until permission is granted — call this right after
// getUserMedia succeeds so the picker shows real camera names.
export function refreshCameraDevices(): Promise<void> {
  return refresh();
}
