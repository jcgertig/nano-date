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

    this.proxy = new Proxy(this, {
      get: (obj, prop) => {
        if (prop in obj) {
          return obj[prop];
        } else if (passThroughMethods.indexOf(prop) > -1) {
          return obj._date[prop].bind(obj._date);
        } else {
          const build = obj._buildSetFunction.bind(obj, obj);
          switch (prop) {
            case 'setUTCNanoseconds':
            case 'setNanoseconds':
              return build(
                'setNanoseconds',
                ['nanosecond'],
                obj.proxy.getUTCNanoseconds,
                NANO,
                () => {},
                false
              );
            case 'setUTCMicroseconds':
            case 'setMicroseconds':
              return build(
                'setMicoseconds',
                ['microsecond', 'nanosecond'],
                obj.proxy.getUTCMicroseconds,
                MICRO,
                obj.proxy.setUTCNanoseconds,
                false
              );
            case 'setUTCMilliseconds':
            case 'setMilliseconds':
              return build(
                'setMilliseconds',
                ['millisecond', 'microsecond', 'nanosecond'],
                obj.proxy.getUTCMilliseconds,
                MILLI,
                obj.proxy.setUTCMicroseconds,
                false
              );
            case 'setUTCSeconds':
              return build(
                'setUTCSeconds',
                ['second', 'millisecond', 'microsecond', 'nanosecond'],
                obj.proxy.getUTCSeconds,
                SECOND,
                obj.proxy.setUTCMilliseconds,
                true
              );
            case 'setSeconds':
              return build(
                'setSeconds',
                ['second', 'millisecond', 'microsecond', 'nanosecond'],
                obj.proxy.getSeconds,
                SECOND,
                obj.proxy.setMilliseconds,
                false
              );
            case 'setUTCMinutes':
              return build(
                'setUTCMinutes',
                ['minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
                obj.proxy.getUTCMinutes,
                MINUTE,
                obj.proxy.setUTCSeconds,
                true
              );
            case 'setMinutes':
              return build(
                'setMinutes',
                ['minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
                obj.proxy.getMinutes,
                MINUTE,
                obj.proxy.setSeconds,
                false
              );
            case 'setUTCHours':
              return build(
                'setUTCHours',
                ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
                obj.proxy.getUTCHours,
                HOUR,
                obj.proxy.setUTCMinutes,
                true
              );
            case 'setHours':
              return build(
                'setHours',
                ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
                obj.proxy.getHours,
                HOUR,
                obj.proxy.setMinutes,
                false
              );
            case 'setUTCDate':
              return build(
                'setUTCDate',
                ['day'],
                obj.proxy.getUTCDate,
                DAY,
                () => {},
                true
              );
            case 'setDate':
              return build(
                'setDate',
                ['day'],
                obj.proxy.getDate,
                DAY,
                () => {},
                false
              );
            case 'setUTCMonth':
              return build(
                'setUTCMonth',
                ['month', 'day'],
                obj.proxy.getUTCMonth,
                MONTH,
                obj.proxy.setUTCDate,
                true
              );
            case 'setMonth':
              return build(
                'setMonth',
                ['month', 'day'],
                obj.proxy.getMonth,
                MONTH,
                obj.proxy.setDate,
                false
              );
            case 'setUTCFullYear':
              return build(
                'setUTCFullYear',
                ['year', 'month', 'day'],
                obj.proxy.getUTCFullYear,
                YEAR,
                obj.proxy.setUTCMonth,
                true
              );
            case 'setFullYear':
              return build(
                'setFullYear',
                ['year', 'month', 'day'],
                obj.proxy.getFullYear,
                YEAR,
                obj.proxy.setMonth,
                false
              );
          }
        }
      }
    });

    if (typeof a === 'string' && ISO_8601_FULL.test(a) && a.indexOf('.') > -1) {
      const match = a.match(ISO_8601_FULL);
      if (typeof match[1] !== 'undefined') {
        const padded = padEndTo(match[1].replace('.', ''), 9);
        let nanos = parseInt(padded, 10);

        // set milliseconds
        if (nanos > 0) {
          this.proxy.setMilliseconds(Math.floor(nanos / MILLI_TO_NANO_DIFF));
          nanos = nanos % MILLI_TO_NANO_DIFF;
        }

        // set microseconds
        if (nanos > 0) {
          this.proxy.setMicroseconds(Math.floor(nanos / 1000));
          nanos = nanos % 1000;
        }

        // set nanoseconds
        if (nanos > 0) {
          this.proxy.setNanoseconds(Math.floor(nanos));
        }
      }
    }

    return this.proxy;
  }

  @decorate(memoize(100))
  _buildSetFunction(scope, name, argumentNames, getMethod, valueKey, moreVarsFunc = () => {}, utc = false) {
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

  _setupFunctions() {
    this._date = new BaseDate(this.valueOf());
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
    return utc ? this.proxy.getUTCFullYear() : this.proxy.getFullYear();
  }

  _getDate(utc) {
    return utc ? this.proxy.getUTCDate() : this.proxy.getDate();
  }

  _getMonth(utc) {
    return utc ? this.proxy.getUTCMonth() : this.proxy.getMonth();
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
    return parseFloat(`${this.valueOf()}.${pad(this.proxy.getMicroseconds())}`, 10);
  }

  valueOfWithNano() {
    return `${this.valueOfWithMicro().toFixed(3)}${pad(this.proxy.getNanoseconds())}`;
  }

  getMicroseconds() {
    return this._full
      .minus(this.valueOf() * MILLI_TO_NANO_DIFF)
      .dividedBy(1000)
      .truncated()
      .toNumber();
  }

  getUTCMicroseconds() {
    return this.proxy.getMicroseconds();
  }

  getNanoseconds() {
    return this._full
      .minus(this.valueOf() * MILLI_TO_NANO_DIFF)
      .minus(this.proxy.getMicroseconds() * 1000)
      .truncated()
      .toNumber();
  }

  getUTCNanoseconds() {
    return this.proxy.getNanoseconds();
  }

  setTime(time) {
    this._full = toNano(time);
    this._setupFunctions();
    return time;
  }

  setUTCTime(time) {
    return this.proxy.setTime(time);
  }

  _toString(funcName) {
    const split = this._date[funcName]().split(' GMT');
    const milli = this.proxy.getMilliseconds();
    const micro = this.proxy.getMicroseconds();
    const nano = this.proxy.getNanoseconds();
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
    const micro = this.proxy.getMicroseconds();
    const nano = this.proxy.getNanoseconds();
    return this._date.toISOString().replace('Z', `${pad(micro)}${pad(nano)}Z`);
  }

  @deprecate('Use toUTCString() instead')
  toGMTString() {
    return this.toUTCString();
  }

}

export default NanoDate;
