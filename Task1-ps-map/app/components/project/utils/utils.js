/* eslint-disable */
export function now() {
  return new Date().getTime();
}

export function rand(min, max) {
  if (arguments.length === 1) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}
