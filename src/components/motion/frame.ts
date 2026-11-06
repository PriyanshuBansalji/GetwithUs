/**
 * One requestAnimationFrame loop shared by every motion component (the orbit,
 * pointer effects, the services stack). It runs only while something is
 * subscribed, so a still page schedules nothing.
 */
type FrameCallback = (time: number) => void;

const callbacks = new Set<FrameCallback>();
let handle = 0;

function tick(time: number) {
  handle = 0;
  for (const callback of [...callbacks]) callback(time);
  if (callbacks.size > 0) handle = requestAnimationFrame(tick);
}

/** Calls `callback` every frame until the returned function is called. */
export function onFrame(callback: FrameCallback): () => void {
  callbacks.add(callback);
  if (!handle) handle = requestAnimationFrame(tick);
  return () => {
    callbacks.delete(callback);
  };
}
