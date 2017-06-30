import BigNumber from 'bignumber.js';
import { autobind, decorate, deprecate } from 'core-decorators';
import memoize from 'memoizerific';

// Cache original 'Date' class. User may set window.Date = NanoDate;
if (typeof window === 'undefined') {
  var Date = Date;
} else {
  var Date = window['Date'];
}

const MILLI_TO_NANO_DIFF = 1000000;
const DIGETS_IN_NANO = 19;
const DIGETS_IN_MILLI = 13;
const MINIMUM_DIGETS = DIGETS_IN_NANO - DIGETS_IN_MILLI;

const YEAR = 'year';
const MONTH = 'month';
const DAY = 'day';
const HOUR = 'hour';
const MINUTE = 'minute';
const SECOND = 'second';
const MILLI = 'milli';
const MICRO = 'micro';
const NANO = 'nano';

const DAYS = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
};

function pad(num) {
  return addZeros(num, num < 100 ? (num < 10 ? 2 : 1) : 0, true);
}

function addZeros(str, count = 0, front = false) {
  if (count === 0) {
    return str;
  }
  return addZeros(`${front ? '0' : ''}${str}${!front ? '0' : ''}`, count - 1, front);
}

function toNano(num) {
  const str = `${num}`;
  if (str.length <= DIGETS_IN_NANO) {
    if (str.indexOf('.') > -1) {
      return new BigNumber(str.replace('.', '') + '000');
    }
    return new BigNumber(str);
  }
  return new BigNumber(str.slice(0, DIGETS_IN_NANO));
}

function onlyDigets(num) {
  return /^(-)?\d+$/.test(`${num}`);
}

function leapYear(yearBase) {
  const year = yearBase.toNumber();
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function daysForYear(year) {
  return leapYear(year) ? 366 : 365;
}

function daysForMonth(month) {
  return DAYS[month.toNumber()];
}

function handleNotAnInteger(items, funcName, names, index = 0) {
  const item = items[index];
  const name = names[index];
  if (typeof item !== 'number' || !onlyDigets(item)) {
    throw new Error(`Parameter ${name} value for ${funcName} has to be an integer.`);
  } else if (names.length > index && notUndefined(items[index + 1])) {
    handleNotAnInteger(items, funcName, names, index + 1);
  }
}

function notUndefined(item) {
  return typeof item !== 'undefined';
}

function buildSetFunction(scope, name, argumentNames, getMethod, valueKey, moreVarsFunc = () => {}) {
  function setFunction(...args) {
    handleNotAnInteger(args, name, argumentNames);
    const currentValue = getMethod();
    if (currentValue !== args[0]) {
      if (currentValue < args[0]) {
        scope._full = scope._full.plus(scope._getValue.call(scope, scope, valueKey, args[0] - currentValue)).truncated();
      } else {
        scope._full = scope._full.minus(scope._getValue.call(scope, scope, valueKey, currentValue - args[0])).truncated();
      }

      if (args.length === 1 || (args.length > 1 && !notUndefined(args[1]))) {
        scope._setupFunctions.call(scope);
      }
    }

    if (args.length > 1 && notUndefined(args[1])) {
      args.pop();
      moreVarsFunc.apply(scope, args);
    }

    return getMethod();
  }

  Object.defineProperty(setFunction, 'name', { value: name, writable: false });

  return setFunction.bind(scope);
}

const passThroughMethods = [
  'getFullYear',
  'getYear',
  'getMonth',
  'getDate',
  'getDay',
  'getHours',
  'getMinutes',
  'getSeconds',
  'getMilliseconds',
  'getUTCFullYear',
  'getUTCYear',
  'getUTCMonth',
  'getUTCDate',
  'getUTCDay',
  'getUTCHours',
  'getUTCMinutes',
  'getUTCSeconds',
  'getUTCMilliseconds',
  'toDateString',
  'toLocaleDateString',
  'toLocaleString',
  'toLocaleTimeString',
  'toISOString'
];

@autobind
class NanoDate {
  constructor(a, month, day, hour, minute, second, millisecond) {
    if (typeof a === 'string') {
      this._full = onlyDigets(a) ? toNano(a) : toNano(new Date(a).valueOf() * MILLI_TO_NANO_DIFF);
    } else if (arguments.length === 0) {
      this._full = toNano(new Date().valueOf() * MILLI_TO_NANO_DIFF);
    } else if (arguments.length === 1) {
      if (a instanceof NanoDate) {
        this._full = a._full;
      } else if (a instanceof Date) {
        this._full = toNano(a.valueOf() * MILLI_TO_NANO_DIFF);
      } else if (typeof a === 'number') {
        this._full = toNano(a);
      } else {
        throw Error('Input not of any type that can be converted to a date');
      }
    } else {
      const d = new Date(a, month || 0, day || 0, hour || 0, minute || 0, second || 0, millisecond || 0);
      this._full = toNano(d.valueOf());
    }

    this._setupFunctions();
  }

  _setupFunctions() {
    this._date = new Date(this.valueOf());
    passThroughMethods.forEach((name) => {
      this[name] = (...args) => this._date[name](...args);
    });

    this._buildSetFunctions();
  }

  @decorate(memoize(250))
  _getDaysBetween(a, b, func) {
    if (a.eq(b)) { return new BigNumber(0); }
    let days = new BigNumber(0);
    const diff = a.lt(b) ? 1 : -1;
    let start = new BigNumber(a);
    while (!start.eq(b)) {
      days = days.plus(func(start));
      start = start.plus(diff);
    }
    return days.times(diff);
  }

  _getDays(unit) {
    let base = new BigNumber(unit);
    let res = new BigNumber(0);
    if (unit >= 12) {
      const years = base.dividedToIntegerBy(12);
      const start = new BigNumber(this.getFullYear());
      const end = start.plus(years);
      res = this._getDaysBetween(start, end, daysForYear);
      base = base.plus(years.times(12).times(base.lessThan(0) ? 1 : -1));
    }

    const start = new BigNumber(this.getMonth());
    const end = start.plus(base);
    return res.plus(this._getDaysBetween(start, end, daysForMonth));
  }

  @decorate(memoize(100))
  _getValue(scope, type, unit) {
    const numUnit = new BigNumber(unit);
    switch (type) {
      case YEAR:
        return scope._getValue(scope, MONTH, numUnit.times(12));
      case MONTH:
        return scope._getValue(scope, DAY, scope._getDays(unit));
      case DAY:
        return scope._getValue(scope, HOUR, unit.times(24));
      case HOUR:
        return scope._getValue(scope, MINUTE, unit.times(60));
      case MINUTE:
        return scope._getValue(scope, SECOND, unit.times(60));
      case SECOND:
        return scope._getValue(scope, MILLI, unit.times(1000));
      case MILLI:
        return scope._getValue(scope, MICRO, unit.times(1000));
      case MICRO:
        return scope._getValue(scope, NANO, unit.times(1000));
      case NANO:
      default:
        return unit;
    }
  }

  static now() {
    return (new NanoDate()).valueOf();
  }

  static parse(...args) {
    return new NanoDate(...args);
  }

  static UTC(...args) {
    return new NanoDate(...args);
  }

  getTime() {
    return this._full.toString();
  }

  valueOf() {
    return this._full.dividedBy(MILLI_TO_NANO_DIFF).truncated().toNumber();
  }

  valueOfWithMicro() {
    return parseFloat(`${this.valueOf()}.${pad(this.getMicroseconds())}`, 10);
  }

  valueOfWithNano() {
    return `${this.valueOfWithMicro()}${pad(this.getNanoseconds())}`;
  }

  getMicroseconds() {
    return this._full
      .minus(this.valueOf() * MILLI_TO_NANO_DIFF)
      .dividedBy(1000)
      .truncated()
      .toNumber();
  }

  getNanoseconds() {
    return this._full
      .minus(this.valueOf() * MILLI_TO_NANO_DIFF)
      .minus(this.getMicroseconds() * 1000)
      .truncated()
      .toNumber();
  }

  _buildSetFunctions() {
    const build = buildSetFunction.bind(this, this);

    this.setUTCNanoseconds = this.setNanoseconds = build(
      'setNanoseconds',
      ['nanosecond'],
      this.getNanoseconds,
      NANO
    );

    this.setUTCMicroseconds = this.setMicroseconds = build(
      'setMicoseconds',
      ['microsecond', 'nanosecond'],
      this.getMicroseconds,
      MICRO,
      this.setNanoseconds
    );

    this.setUTCMilliseconds = this.setMilliseconds = build(
      'setMilliseconds',
      ['millisecond', 'microsecond', 'nanosecond'],
      this.getMilliseconds,
      MILLI,
      this.setMicroseconds
    );

    this.setUTCSeconds = this.setSeconds = build(
      'setSeconds',
      ['second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getSeconds,
      SECOND,
      this.setMilliseconds
    );

    this.setUTCHours = this.setHours = build(
      'setHours',
      ['hour', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getHours,
      HOUR,
      this.setMilliseconds
    );

    this.setUTCDate = this.setDate = build(
      'setDate',
      ['day'],
      this.getDate,
      DAY
    );

    this.setUTCMonth = this.setMonth = build(
      'setMonth',
      ['month', 'day'],
      this.getMonth,
      MONTH,
      this.setDate
    );

    this.setUTCFullYear = this.setFullYear = build(
      'setFullYear',
      ['year', 'month', 'day'],
      this.getFullYear,
      YEAR,
      this.setMonth
    );
  }

  setTime(time) {
    this._full = toNano(time);
    this._setupFunctions();
    return time;
  }

  setUTCTime(time) {
    return this.setTime(time);
  }

  _toString(funcName) {
    const split = this._date[funcName]().split(' GMT');
    const milli = this.getMilliseconds();
    const micro = this.getMicroseconds();
    const nano = this.getNanoseconds();
    split[0] += `.${pad(milli)}${pad(micro)}${pad(nano)}`
    return split.join(' GMT');
  }

  toString() {
    return this._toString('toString');
  }

  toUTCString() {
    return this._toString('toUTCString');
  }

  @deprecate('Use toUTCString() instead')
  toGMTString() {
    return this.toUTCString();
  }

}

export default NanoDate;
