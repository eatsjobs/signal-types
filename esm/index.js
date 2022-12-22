/*! (c) Andrea Giammarchi */

/**
 * A signal with a value property also exposed via toJSON, toString and valueOf.
 * @template T
 */
export class Signal {
  /** @type {T} */              #value;
  /** @type {Set<function>} */  #effects = new Set;

  /** @param {T} value the value carried through the signal */
  constructor(value) { this.#value = value }

  /** @returns {T} */
  get value() {
    const {length} = effects;
    if (length)
      this.#effects.add(effects[length - 1]);
    return this.#value;
  }

  /** @param {T} value the new value carried through the signal */
  set value(value) {
    if (value === drain)
      dispatch(this.#effects, false);
    else if (this.#value !== value) {
      this.#value = value;
      if (batches === effects)
        dispatch(this.#effects, true);
      else
        batches.push(...this.#effects);
    }
  }

  // EXPLICIT NO SIDE EFFECT
  peek() { return this.#value }

  // IMPLICIT SIDE EFFECT
  then() { return this.value }
  toJSON() { return this.value }
  valueOf() { return this.value }
  toString() { return String(this.value) }
}

/**
 * A read-only Signal extend that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 */
export class Computed extends Signal {
  /**
   * @param {(v?: T) => T} fn the callback invoked when its signals changes
   * @param {T | undefined} value the optional initial value of the callback
   */
  constructor(fn, value) {
    super(value).dispose = effect(() => {
      super.value = fn(this.peek());
    });
  }

  /** @readonly @returns {T} */
  get value() { return super.value }

  set value(_) { throw new Error('computed.value is read-only') }
}

/**
 * Invoke a callback that updates many signals and runs effects only after.
 * @type {(fn:() => void) => void}
 */
export const batch = fn => {
  const root = batches === effects;
  if (root)
    batches = [];
  try { fn() }
  finally {
    if (root) {
      const set = new Set(batches);
      batches = effects;
      dispatch(set, true);
    }
  }
};

/**
 * Returns a Computed signal that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @type {<T>(fn: (v?: T) => T, value?: T) => Computed<T>}
 */
export const computed = (fn, value) => new Computed(fn, value);

/**
 * A unique identifier to instantly free any signal from disposed effects.
 * @type {symbol}
 */
export const drain = Symbol();

/**
 * Invokes a function when any of its internal signals or computed values change.
 * Returns a `dispose` callback.
 * @template T
 * @type {<T>(fn: (v?: T) => T | undefined, value?: T) => () => void}
 */
export const effect = (fn, value) => {
  const fx = () => { value = fn(value) };
  const dispose = () => {
    disposed.add(fx);
    for (const dispose of disposes.get(fx))
      dispose();
  };
  disposes.set(fx, []);
  const i = effects.push(fx) - 1;
  if (i) disposes.get(effects[i - 1]).push(dispose);
  try { return fx(), dispose }
  finally { effects.pop() }
};

/**
 * Returns a writable Signal that side-effects whenever its value gets updated.
 * @template T
 * @type {<T>(value: T) => Signal<T>}
 */
export const signal = value => new Signal(value);


const effects = [];
const disposed = new WeakSet;
const disposes = new WeakMap;
const dispatch = (effects, invoke) => {
  for (const effect of effects) {
    if (disposed.has(effect))
      effects.delete(effect);
    else if (invoke)
      effect();
  }
};

let batches = effects;
