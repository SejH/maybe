class Maybe {
  constructor(value) {
    this.__value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  isNothing() {
    return this.__value === null || this.__value === undefined;
  }

  map(fn) {
    if (this.isNothing()) {
      return Maybe.of(null);
    }

    try {
      return Maybe.of(fn(this.__value));
    } catch (error) {
      console.error(error);
      return Maybe.of(null);
    }
  }

  join() {
    return this.__value;
  }

  chain(f) {
    return this.map(f).join();
  }

  orElse(defaultValue) {
    return this.isNothing()
      ? Maybe.of(defaultValue)
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
