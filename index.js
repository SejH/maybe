class Maybe {
  constructor(value, error = null) {
    this.__value = value;
    this.__error = error;
  }

  static of(value, error) {
    return new Maybe(value, error);
  }

  isNothing() {
    return this.__value === null || this.__value === undefined;
  }

  map(fn) {
    if (this.isNothing()) {
      return Maybe.of(null, this.__error);
    }

    try {
      return Maybe.of(fn(this.__value));
    } catch (error) {
      return Maybe.of(null, error);
    }
  }

  join() {
    return this.__value;
  }

  chain(f) {
    return this.map(f).join();
  }

  orElse(fn) {
    return this.isNothing()
      ? Maybe.of(fn(this.__error))
      : this;
  }

  ap(m2) {
    return m2.map(this.__value);
  }

  static utils() {
    return {
      map: fn => m => m.map(fn),
      chain: fn => m => m.chain(fn),
      ap: mf => m => mf.ap(m),
      orElse: val => m => m.orElse(val),
      lift: fn => (...args) => (
        args.reduce((acc, m) => (
          m.map(y => acc.chain(l => l.concat(y)))
        ), Maybe.of([]))
          .map(x => fn.apply(null, x))
      )
    };
  }
}

module.exports = Maybe;
