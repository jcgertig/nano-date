import BigNumber from 'bignumber.js';
import { autobind, decorate, deprecate } from 'core-decorators';
import memoize from 'memoizerific';

// Cache original 'Date' class. User may set window.Date = NanoDate;
if (typeof window === 'undefined') {
  /* istanbul ignore next */
  var BaseDate = Date;
} else {
  var BaseDate = window.Date;
}

const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

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
  0: 31,
  1: 28,
  2: 31,
  3: 30,
  4: 31,
  5: 30,
  6: 31,
  7: 31,
  8: 30,
  9: 31,
  10: 30,
  11: 31
};

const DAYS_LEAP_YEAR = {
  0: 31,
  1: 29,
  2: 31,
  3: 30,
  4: 31,
  5: 30,
  6: 31,
  7: 31,
  8: 30,
  9: 31,
  10: 30,
  11: 31
};

function pad(num) {
  return addZeros(num, num < 100 ? (num < 10 ? 2 : 1) : 0, true);
}

function padEndTo(num, toLen) {
  return addZeros(num, 9 - `${num}`.length);
}

function addZeros(str, count = 0, front = false) {
  if (count === 0) {
    return str;
  }
  return addZeros(`${front ? '0' : ''}${str}${!front ? '0' : ''}`, count - 1, front);
}

function toNano(num) {
  let str = `${num}`;
  if (str.length <= DIGETS_IN_NANO) {
    if (str.indexOf('.') > -1) {
      str = num.toFixed(3);
      return new BigNumber(str.replace('.', '') + '000');
    }
    return new BigNumber(str);
  }
  return new BigNumber(str.slice(0, DIGETS_IN_NANO));
}

function onlyDigits(num) {
  return /^(-)?\d+$/.test(`${num}`);
}

function leapYear(yearBase) {
  const year = yearBase.toNumber();
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function daysForYear(year) {
  return leapYear(year) ? 366 : 365;
}

function daysForMonth(year, month) {
  const days = leapYear(year) ? DAYS_LEAP_YEAR : DAYS;
  return days[month.toNumber()];
}

function handleNotAnInteger(items, funcName, names, index = 0) {
  const item = items[index];
  const name = names[index];
  if (typeof item !== 'number' || !onlyDigits(item)) {
    throw new Error(`Parameter ${name} value for ${funcName} has to be an integer.`);
  } else if (names.length > index && notUndefined(items[index + 1])) {
    handleNotAnInteger(items, funcName, names, index + 1);
  }
}

function notUndefined(item) {
  return typeof item !== 'undefined';
}

function buildSetFunction(scope, name, argumentNames, getMethod, valueKey, moreVarsFunc = () => {}, utc = false) {
  function setFunction(...args) {
    handleNotAnInteger(args, name, argumentNames);
    const currentValue = getMethod();
    if (currentValue !== args[0]) {
      if (currentValue < args[0]) {
        const v = scope._getValue.call(scope, scope, valueKey, args[0] - currentValue, utc);
        scope._full = scope._full.plus(v).truncated();
      } else {
        const v = scope._getValue.call(scope, scope, valueKey, currentValue - args[0], utc);
        scope._full = scope._full.minus(v).truncated();
      }

      if (args.length === 1 || (args.length > 1 && !notUndefined(args[1]))) {
        scope._setupFunctions.call(scope);
      }
    }

    if (args.length > 1 && notUndefined(args[1])) {
      args.shift();
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
  'toTimeString',
  'toLocaleTimeString',
  'toISOString',
  'getTimezoneOffset'
];

@autobind
class NanoDate {
  constructor(a, b, c, d, e, f, g, h) {
    if (typeof a === 'string') {
      this._full = onlyDigits(a) ? toNano(a) : toNano(new BaseDate(a).valueOf() * MILLI_TO_NANO_DIFF);
    } else if (arguments.length === 0) {
      this._full = toNano(new BaseDate().valueOf() * MILLI_TO_NANO_DIFF);
    } else if (arguments.length === 1) {
      if (a instanceof NanoDate) {
        this._full = a._full;
      } else if (a instanceof BaseDate) {
        this._full = toNano(a.valueOf() * MILLI_TO_NANO_DIFF);
      } else if (typeof a === 'number') {
        let multi = MILLI_TO_NANO_DIFF;
        if (`${a}`.indexOf('.') > -1) {
          multi = 1;
        }
        this._full = toNano(a * multi);
      } else {
        throw Error('Input not of any type that can be converted to a date');
      }
    } else {
      let date;
      if (typeof a === 'boolean') {
        date = BaseDate.UTC(b, c || 0, d || 0, e || 0, f || 0, g || 0, h || 0);
      } else {
        date = new BaseDate(a, b, c || 0, d || 0, e || 0, f || 0, g || 0);
      }
      this._full = toNano(date.valueOf() * MILLI_TO_NANO_DIFF);
    }

    this._setupFunctions();

    if (typeof a === 'string' && ISO_8601_FULL.test(a) && a.indexOf('.') > -1) {
      const match = a.match(ISO_8601_FULL);
      if (typeof match[1] !== 'undefined') {
        const padded = padEndTo(match[1].replace('.', ''), 9);
        let nanos = parseInt(padded, 10);

        // set milliseconds
        if (nanos > 0) {
          this.setMilliseconds(Math.floor(nanos / MILLI_TO_NANO_DIFF));
          nanos = nanos % MILLI_TO_NANO_DIFF;
        }

        // set microseconds
        if (nanos > 0) {
          this.setMicroseconds(Math.floor(nanos / 1000));
          nanos = nanos % 1000;
        }

        // set nanoseconds
        if (nanos > 0) {
          this.setNanoseconds(Math.floor(nanos));
        }
      }
    }
  }

  _setupFunctions() {
    this._date = new BaseDate(this.valueOf());
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
      const val = func(start);
      days = days.plus(val);
      start = start.plus(diff);
    }
    return days.times(diff);
  }

  _getFullYear(utc) {
    return utc ? this.getUTCFullYear() : this.getFullYear();
  }

  _getDate(utc) {
    return utc ? this.getUTCDate() : this.getDate();
  }

  _getMonth(utc) {
    return utc ? this.getUTCMonth() : this.getMonth();
  }

  _getDays(unit, utc = false) {
    const currentYear = new BigNumber(this._getFullYear(utc));
    let base = new BigNumber(unit);
    let res = new BigNumber(this._getDate(utc)).minus(1);
    if (unit >= 12) {
      const years = base.dividedToIntegerBy(12);
      const start = new BigNumber(currentYear);
      const end = start.plus(years);
      res = this._getDaysBetween(start, end, daysForYear);
      base = base.plus(years.times(12).times(base.lessThan(0) ? 1 : -1));
    }

    const month = new BigNumber(this._getMonth(utc));
    let diff = month.plus(base);
    if (diff.greaterThan(11)) {
      diff = month.minus(base);
    }
    // console.log('days between', res.toNumber(), diff.toNumber(), month.toNumber());
    if (diff.lessThan(month)) {
      return res.plus(this._getDaysBetween(diff, month, daysForMonth.bind(null, currentYear)));
    }
    return res.plus(this._getDaysBetween(month, diff, daysForMonth.bind(null, currentYear)));
  }

  @decorate(memoize(100))
  _getValue(scope, type, unit, utc = false) {
    const numUnit = new BigNumber(unit);
    switch (type) {
      case YEAR:
        return scope._getValue(scope, MONTH, numUnit.times(12), utc);
      case MONTH:
        return scope._getValue(scope, DAY, scope._getDays(numUnit, utc), utc);
      case DAY:
        return scope._getValue(scope, HOUR, numUnit.times(24), utc);
      case HOUR:
        return scope._getValue(scope, MINUTE, numUnit.times(60), utc);
      case MINUTE:
        return scope._getValue(scope, SECOND, numUnit.times(60), utc);
      case SECOND:
        return scope._getValue(scope, MILLI, numUnit.times(1000), utc);
      case MILLI:
        return scope._getValue(scope, MICRO, numUnit.times(1000), utc);
      case MICRO:
        return scope._getValue(scope, NANO, numUnit.times(1000), utc);
      case NANO:
      default:
        return numUnit;
    }
  }

  static now() {
    return (new NanoDate()).valueOf();
  }

  static parse(...args) {
    return BaseDate.parse(...args);
  }

  static UTC(...args) {
    return new NanoDate(true, ...args);
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
    return `${this.valueOfWithMicro().toFixed(3)}${pad(this.getNanoseconds())}`;
  }

  getMicroseconds() {
    return this._full
      .minus(this.valueOf() * MILLI_TO_NANO_DIFF)
      .dividedBy(1000)
      .truncated()
      .toNumber();
  }

  getUTCMicroseconds() {
    return this.getMicroseconds();
  }

  getNanoseconds() {
    return this._full
      .minus(this.valueOf() * MILLI_TO_NANO_DIFF)
      .minus(this.getMicroseconds() * 1000)
      .truncated()
      .toNumber();
  }

  getUTCNanoseconds() {
    return this.getNanoseconds();
  }

  _buildSetFunctions() {
    const build = buildSetFunction.bind(this, this);

    this.setUTCNanoseconds = this.setNanoseconds = build(
      'setNanoseconds',
      ['nanosecond'],
      this.getUTCNanoseconds,
      NANO
    );

    this.setUTCMicroseconds = this.setMicroseconds = build(
      'setMicoseconds',
      ['microsecond', 'nanosecond'],
      this.getUTCMicroseconds,
      MICRO,
      this.setUTCNanoseconds
    );

    this.setUTCMilliseconds = this.setMilliseconds = build(
      'setMilliseconds',
      ['millisecond', 'microsecond', 'nanosecond'],
      this.getUTCMilliseconds,
      MILLI,
      this.setUTCMicroseconds
    );

    this.setUTCSeconds = build(
      'setUTCSeconds',
      ['second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getUTCSeconds,
      SECOND,
      this.setUTCMilliseconds,
      true
    );

    this.setSeconds = build(
      'setSeconds',
      ['second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getSeconds,
      SECOND,
      this.setMilliseconds
    );

    this.setUTCMinutes = build(
      'setUTCMinutes',
      ['minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getUTCMinutes,
      MINUTE,
      this.setUTCSeconds,
      true
    );

    this.setMinutes = build(
      'setMinutes',
      ['minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getMinutes,
      MINUTE,
      this.setSeconds
    );

    this.setUTCHours = build(
      'setUTCHours',
      ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getUTCHours,
      HOUR,
      this.setUTCMinutes,
      true
    );

    this.setHours = build(
      'setHours',
      ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getHours,
      HOUR,
      this.setMinutes
    );

    this.setUTCDate = build(
      'setUTCDate',
      ['day'],
      this.getUTCDate,
      DAY,
      () => {},
      true
    );

    this.setDate = build(
      'setDate',
      ['day'],
      this.getDate,
      DAY
    );

    this.setUTCMonth = build(
      'setUTCMonth',
      ['month', 'day'],
      this.getUTCMonth,
      MONTH,
      this.setUTCDate,
      true
    );

    this.setMonth = build(
      'setMonth',
      ['month', 'day'],
      this.getMonth,
      MONTH,
      this.setDate
    );

    this.setUTCFullYear = build(
      'setUTCFullYear',
      ['year', 'month', 'day'],
      this.getUTCFullYear,
      YEAR,
      this.setUTCMonth,
      true
    );

    this.setFullYear = build(
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
    split[0] += `.${pad(milli)}${pad(micro)}${pad(nano)}`;
    return split.join(' GMT');
  }

  toString() {
    return this._toString('toString');
  }

  toUTCString() {
    return this._toString('toUTCString');
  }

  toISOStringFull() {
    const micro = this.getMicroseconds();
    const nano = this.getNanoseconds();
    return this._date.toISOString().replace('Z', `${pad(micro)}${pad(nano)}Z`);
  }

  @deprecate('Use toUTCString() instead')
  toGMTString() {
    return this.toUTCString();
  }

}

export default NanoDate;
