import BigNumber from 'bignumber.js';
import memoize from 'memoizerific';

const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

const MILLI_TO_NANO_DIFF = 1000000;
const DIGETS_IN_NANO = 19;
// const DIGETS_IN_MILLI = 13;
// const MINIMUM_DIGETS = DIGETS_IN_NANO - DIGETS_IN_MILLI;

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

function noop () {
  /** No Operation */
}

function pad (num: number) {
  return addZeros(num, num < 100 ? (num < 10 ? 2 : 1) : 0, true);
}

function padEndTo (num: number | string, toLen: number = 9) {
  return addZeros(num, toLen - `${num}`.length);
}

function addZeros (
  str: number | string,
  count: number = 0,
  front: boolean = false
) {
  if (count === 0) {
    return str;
  }
  return addZeros(
    `${front ? '0' : ''}${str}${!front ? '0' : ''}`,
    count - 1,
    front
  );
}

function toNano (num: number | string) {
  let str = `${num}`;
  if (str.length <= DIGETS_IN_NANO) {
    if (str.indexOf('.') > -1) {
      str = (typeof num === 'string' ? parseFloat(num) : num).toFixed(3);
      return new BigNumber(str.replace('.', '') + '000');
    }
    return new BigNumber(str);
  }
  return new BigNumber(str.slice(0, DIGETS_IN_NANO));
}

function onlyDigits (num: number | string) {
  return /^(-)?\d+$/.test(`${num}`);
}

function leapYear (yearBase: BigNumber) {
  const year = yearBase.toNumber();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysForYear (year: BigNumber) {
  return leapYear(year) ? 366 : 365;
}

function daysForMonth (year: BigNumber, month: BigNumber) {
  const days = leapYear(year) ? DAYS_LEAP_YEAR : DAYS;
  return days[month.toNumber()];
}

function handleNotAnInteger (
  items: Array<number | string>,
  funcName: string,
  names: Array<string>,
  index: number = 0
) {
  const item = items[index];
  const name = names[index];
  if (typeof item !== 'number' || !onlyDigits(item)) {
    throw new Error(
      `Parameter ${name} value for ${funcName} has to be an integer.`
    );
  } else if (names.length > index && notUndefined(items[index + 1])) {
    handleNotAnInteger(items, funcName, names, index + 1);
  }
}

function notUndefined (item?: any) {
  return typeof item !== 'undefined';
}

class NanoDate {
  public get full (): BigNumber {
    return this._full;
  }

  static now () {
    return new NanoDate().valueOf();
  }

  static parse (input) {
    return Date.parse(input);
  }

  static UTC (
    year: number,
    month: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number
  ) {
    return Date.UTC(
      year,
      month,
      date || 0,
      hours || 0,
      minutes || 0,
      seconds || 0,
      milliseconds || 0
    );
  }

  private _full: BigNumber;
  private _date: Date;

  private buildSetFunction = memoize(100)(
    (
      scope,
      name,
      argumentNames,
      getMethod,
      valueKey,
      moreVarsFunc = noop,
      utc = false
    ) => {
      function setFunction (...args) {
        handleNotAnInteger(args, name, argumentNames);
        const currentValue = getMethod();
        if (currentValue !== args[0]) {
          if (currentValue < args[0]) {
            const v = scope.getValue.call(
              scope,
              scope,
              valueKey,
              args[0] - currentValue,
              utc
            );
            scope._full = scope._full.plus(v);
          } else {
            const v = scope.getValue.call(
              scope,
              scope,
              valueKey,
              currentValue - args[0],
              utc
            );
            scope._full = scope._full.minus(v);
          }

          if (
            args.length === 1 ||
            (args.length > 1 && !notUndefined(args[1]))
          ) {
            scope.setupFunctions.call(scope);
          }
        }

        if (args.length > 1 && notUndefined(args[1])) {
          args.shift();
          moreVarsFunc.apply(scope, args);
        }

        return getMethod();
      }

      Object.defineProperty(setFunction, 'name', {
        value: name,
        writable: false
      });

      return setFunction.bind(scope);
    }
  );

  private getDaysBetween = memoize(250)((a, b, func) => {
    if (a.eq(b)) {
      return new BigNumber(0);
    }
    let days = new BigNumber(0);
    const diff = a.lt(b) ? 1 : -1;
    let start = new BigNumber(a);
    while (!start.eq(b)) {
      const val = func(start);
      days = days.plus(val);
      start = start.plus(diff);
    }
    return days.times(diff);
  });

  private getValue = memoize(100)((scope, type, unit, utc = false) => {
    const numUnit = new BigNumber(unit);
    switch (type) {
      case YEAR:
        return scope.getValue(scope, MONTH, numUnit.times(12), utc);
      case MONTH:
        return scope.getValue(scope, DAY, scope._getDays(numUnit, utc), utc);
      case DAY:
        return scope.getValue(scope, HOUR, numUnit.times(24), utc);
      case HOUR:
        return scope.getValue(scope, MINUTE, numUnit.times(60), utc);
      case MINUTE:
        return scope.getValue(scope, SECOND, numUnit.times(60), utc);
      case SECOND:
        return scope.getValue(scope, MILLI, numUnit.times(1000), utc);
      case MILLI:
        return scope.getValue(scope, MICRO, numUnit.times(1000), utc);
      case MICRO:
        return scope.getValue(scope, NANO, numUnit.times(1000), utc);
      case NANO:
      default:
        return numUnit;
    }
  });

  constructor (value?: number | string | Date | NanoDate);
  constructor (
    year: number,
    monthIndex: number,
    day?: number,
    hour?: number,
    minute?: number,
    second?: number,
    millisecond?: number
  );
  constructor (a?, b?, c = 0, d = 0, e = 0, f = 0, g = 0) {
    if (arguments.length === 0) {
      this._full = toNano(Date.now() * MILLI_TO_NANO_DIFF);
    } else if (typeof a === 'string') {
      this._full = onlyDigits(a)
        ? toNano(a)
        : toNano(new Date(a).valueOf() * MILLI_TO_NANO_DIFF);
    } else if (a instanceof NanoDate) {
      this._full = new BigNumber(a.full);
    } else if (a instanceof Date) {
      this._full = toNano(a.valueOf() * MILLI_TO_NANO_DIFF);
    } else if (arguments.length === 1 && typeof a === 'number') {
      let multi = MILLI_TO_NANO_DIFF;
      if (
        `${a}`.indexOf('.') > -1 ||
        (`${a}`.indexOf('.') < 0 && `${a}`.length === DIGETS_IN_NANO)
      ) {
        multi = 1;
      }
      this._full = toNano(a * multi);
    } else if (arguments.length === 1) {
      throw Error('Input not of any type that can be converted to a date');
    } else {
      let date = new Date(a, b, c, d, e, f, g);
      this._full = toNano(date.valueOf() * MILLI_TO_NANO_DIFF);
    }

    this.setupFunctions();

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

  public setUTCNanoseconds = (nanoseconds: number) => {
    return this.buildSetFunction(
      this,
      'setNanoseconds',
      ['nanosecond'],
      this.getUTCNanoseconds,
      NANO,
      noop,
      true
    )(nanoseconds);
  };

  public setNanoseconds = (nanoseconds: number) => {
    return this.buildSetFunction(
      this,
      'setNanoseconds',
      ['nanosecond'],
      this.getNanoseconds,
      NANO,
      noop,
      false
    )(nanoseconds);
  };

  public setUTCMicroseconds = (microseconds: number, nanoseconds?: number) => {
    return this.buildSetFunction(
      this,
      'setMicoseconds',
      ['microsecond', 'nanosecond'],
      this.getUTCMicroseconds,
      MICRO,
      this.setUTCNanoseconds,
      true
    )(microseconds, nanoseconds);
  };

  public setMicroseconds = (microseconds: number, nanoseconds?: number) => {
    return this.buildSetFunction(
      this,
      'setMicoseconds',
      ['microsecond', 'nanosecond'],
      this.getMicroseconds,
      MICRO,
      this.setNanoseconds,
      false
    )(microseconds, nanoseconds);
  };

  public setUTCMilliseconds = (
    milliseconds: number,
    microseconds?: number,
    nanoseconds?: number
  ) => {
    return this.buildSetFunction(
      this,
      'setMilliseconds',
      ['millisecond', 'microsecond', 'nanosecond'],
      this.getUTCMilliseconds,
      MILLI,
      this.setUTCMicroseconds,
      true
    )(milliseconds, microseconds, nanoseconds);
  };

  public setMilliseconds = (
    milliseconds: number,
    microseconds?: number,
    nanoseconds?: number
  ) => {
    return this.buildSetFunction(
      this,
      'setMilliseconds',
      ['millisecond', 'microsecond', 'nanosecond'],
      this.getMilliseconds,
      MILLI,
      this.setMicroseconds,
      false
    )(milliseconds, microseconds, nanoseconds);
  };

  public setUTCSeconds = (
    seconds: number,
    milliseconds?: number,
    microseconds?: number,
    nanoseconds?: number
  ) => {
    return this.buildSetFunction(
      this,
      'setUTCSeconds',
      ['second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getUTCSeconds,
      SECOND,
      this.setUTCMilliseconds,
      true
    )(seconds, milliseconds, microseconds, nanoseconds);
  };

  public setSeconds = (
    seconds: number,
    milliseconds?: number,
    microseconds?: number,
    nanoseconds?: number
  ) => {
    return this.buildSetFunction(
      this,
      'setSeconds',
      ['second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getSeconds,
      SECOND,
      this.setMilliseconds,
      false
    )(seconds, milliseconds, microseconds, nanoseconds);
  };

  public setUTCMinutes = (
    minutes: number,
    seconds?: number,
    milliseconds?: number,
    microseconds?: number,
    nanoseconds?: number
  ) => {
    return this.buildSetFunction(
      this,
      'setUTCMinutes',
      ['minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getUTCMinutes,
      MINUTE,
      this.setUTCSeconds,
      true
    )(minutes, seconds, milliseconds, microseconds, nanoseconds);
  };

  public setMinutes = (
    minutes: number,
    seconds?: number,
    milliseconds?: number,
    microseconds?: number,
    nanoseconds?: number
  ) => {
    return this.buildSetFunction(
      this,
      'setMinutes',
      ['minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getMinutes,
      MINUTE,
      this.setSeconds,
      false
    )(minutes, seconds, milliseconds, microseconds, nanoseconds);
  };

  public setUTCHours = (
    hours: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number,
    microseconds?: number,
    nanoseconds?: number
  ) => {
    return this.buildSetFunction(
      this,
      'setUTCHours',
      ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getUTCHours,
      HOUR,
      this.setUTCMinutes,
      true
    )(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  };

  public setHours = (
    hours: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number,
    microseconds?: number,
    nanoseconds?: number
  ) => {
    return this.buildSetFunction(
      this,
      'setHours',
      ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      this.getHours,
      HOUR,
      this.setMinutes,
      false
    )(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  };

  public setUTCDate = (date: number) => {
    return this.buildSetFunction(
      this,
      'setUTCDate',
      ['day'],
      this.getUTCDate,
      DAY,
      noop,
      true
    )(date);
  };

  public setDate = (date: number) => {
    return this.buildSetFunction(
      this,
      'setDate',
      ['day'],
      this.getDate,
      DAY,
      noop,
      false
    )(date);
  };

  public setUTCMonth = (month: number, date?: number) => {
    return this.buildSetFunction(
      this,
      'setUTCMonth',
      ['month', 'day'],
      this.getUTCMonth,
      MONTH,
      this.setUTCDate,
      true
    )(month, date);
  };

  public setMonth = (month: number, date?: number) => {
    return this.buildSetFunction(
      this,
      'setMonth',
      ['month', 'day'],
      this.getMonth,
      MONTH,
      this.setDate,
      false
    )(month, date);
  };

  public setUTCFullYear = (year: number, month?: number, date?: number) => {
    return this.buildSetFunction(
      this,
      'setUTCFullYear',
      ['year', 'month', 'day'],
      this.getUTCFullYear,
      YEAR,
      this.setUTCMonth,
      true
    )(year, month, date);
  };

  public setFullYear = (year: number, month?: number, date?: number) => {
    return this.buildSetFunction(
      this,
      'setFullYear',
      ['year', 'month', 'day'],
      this.getFullYear,
      YEAR,
      this.setMonth,
      false
    )(year, month, date);
  };

  /**
   * Gets the year, using local time
   * @memberof NanoDate
   */
  public getFullYear = () => {
    return this._date.getFullYear();
  };

  /**
   * Gets the month, using local time
   * @memberof NanoDate
   */
  public getMonth = () => {
    return this._date.getMonth();
  };

  /**
   * Gets the day-of-the-month, using local time
   * @memberof NanoDate
   */
  public getDate = () => {
    return this._date.getDate();
  };

  /**
   * Gets the day of the week, using local time
   * @memberof NanoDate
   */
  public getDay = () => {
    return this._date.getDay();
  };

  /**
   * Gets the hours in a date, using local time
   * @memberof NanoDate
   */
  public getHours = () => {
    return this._date.getHours();
  };

  /**
   * Gets the minutes in a date, using local time
   * @memberof NanoDate
   */
  public getMinutes = () => {
    return this._date.getMinutes();
  };

  /**
   * Gets the seconds in a date, using local time
   * @memberof NanoDate
   */
  public getSeconds = () => {
    return this._date.getSeconds();
  };

  /**
   * Gets the milliseconds in a date, using local time
   * @memberof NanoDate
   */
  public getMilliseconds = () => {
    return this._date.getMilliseconds();
  };

  /**
   * Gets the year, using Universal Coordinated Time (UTC)
   * @memberof NanoDate
   */
  public getUTCFullYear = () => {
    return this._date.getUTCFullYear();
  };

  /**
   * Gets the month, using Universal Coordinated Time (UTC)
   * @memberof NanoDate
   */
  public getUTCMonth = () => {
    return this._date.getUTCMonth();
  };

  /**
   * Gets the day-of-the-month, using Universal Coordinated Time (UTC)
   * @memberof NanoDate
   */
  public getUTCDate = () => {
    return this._date.getUTCDate();
  };

  /**
   * Gets the day of the week, using Universal Coordinated Time (UTC)
   * @memberof NanoDate
   */
  public getUTCDay = () => {
    return this._date.getUTCDay();
  };

  /**
   * Gets the hours in a date, using Universal Coordinated Time (UTC)
   * @memberof NanoDate
   */
  public getUTCHours = () => {
    return this._date.getUTCHours();
  };

  /**
   * Gets the minutes in a date, using Universal Coordinated Time (UTC)
   * @memberof NanoDate
   */
  public getUTCMinutes = () => {
    return this._date.getUTCMinutes();
  };

  /**
   * Gets the seconds in a date, using Universal Coordinated Time (UTC)
   * @memberof NanoDate
   */
  public getUTCSeconds = () => {
    return this._date.getUTCSeconds();
  };

  /**
   * Gets the milliseconds in a date, using Universal Coordinated Time (UTC)
   * @memberof NanoDate
   */
  public getUTCMilliseconds = () => {
    return this._date.getUTCMilliseconds();
  };

  /**
   * Returns a date as a string
   * @memberof NanoDate
   */
  public toDateString = () => {
    return this._date.toDateString();
  };

  /**
   * Converts a date to a string by using the current or specified locale.
   * @param locales A locale string or array of locale strings that contain one or more language or locale tags.
   * If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale.
   * If you omit this parameter, the default locale of the JavaScript runtime is used.
   * @param options An object that contains one or more properties that specify comparison options.
   * @memberof NanoDate
   */
  public toLocaleDateString = (
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ) => {
    return this._date.toLocaleDateString(locales, options);
  };

  /**
   * Converts a date and time to a string by using the current or specified locale.
   * @param locales A locale string or array of locale strings that contain one or more language or locale tags.
   * If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale.
   * If you omit this parameter, the default locale of the JavaScript runtime is used.
   * @param options An object that contains one or more properties that specify comparison options.
   * @memberof NanoDate
   */
  public toLocaleString = (
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ) => {
    return this._date.toLocaleString(locales, options);
  };

  /**
   * Returns a time as a string
   * @memberof NanoDate
   */
  public toTimeString = () => {
    return this._date.toTimeString();
  };

  /**
   * Converts a time to a string by using the current or specified locale.
   * @param locales A locale string or array of locale strings that contain one or more language or locale tags.
   * If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale.
   * If you omit this parameter, the default locale of the JavaScript runtime is used.
   * @param options An object that contains one or more properties that specify comparison options.
   */
  public toLocaleTimeString = (
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ) => {
    return this._date.toLocaleTimeString(locales, options);
  };

  /**
   * Returns a date as a string value in ISO format
   * @memberof NanoDate
   */
  public toISOString = () => {
    return this._date.toISOString();
  };

  /**
   * Gets the difference in minutes between the time on the local computer and Universal Coordinated Time (UTC).
   * @memberof NanoDate
   */
  public getTimezoneOffset = () => {
    return this._date.getTimezoneOffset();
  };

  public getTime = () => {
    return this._full.toString();
  };

  /**
   * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
   * @memberof NanoDate
   */
  public valueOf = () => {
    return this._full.dividedToIntegerBy(MILLI_TO_NANO_DIFF).toNumber();
  };

  /**
   * Returns the stored time value in milliseconds and microseconds since midnight, January 1, 1970 UTC.
   * @memberof NanoDate
   */
  public valueOfWithMicro = () => {
    return parseFloat(`${this.valueOf()}.${pad(this.getMicroseconds())}`);
  };

  /**
   * Returns the stored time value in milliseconds and nanoseconds since midnight, January 1, 1970 UTC.
   * @memberof NanoDate
   */
  public valueOfWithNano = () => {
    return `${this.valueOfWithMicro().toFixed(3)}${pad(this.getNanoseconds())}`;
  };

  public getMicroseconds = () => {
    return this._full
      .minus(this.valueOf() * MILLI_TO_NANO_DIFF)
      .dividedToIntegerBy(1000)
      .toNumber();
  };

  public getUTCMicroseconds = () => {
    return this.getMicroseconds();
  };

  public getNanoseconds = () => {
    return this._full
      .minus(this.valueOf() * MILLI_TO_NANO_DIFF)
      .minus(this.getMicroseconds() * 1000)
      .toNumber();
  };

  public getUTCNanoseconds = () => {
    return this.getNanoseconds();
  };

  public setTime = (time) => {
    this._full = toNano(time);
    this.setupFunctions();
    return time;
  };

  public setUTCTime = (time) => {
    return this.setTime(time);
  };

  public toString = () => {
    return this._toString('toString');
  };

  public toUTCString = () => {
    return this._toString('toUTCString');
  };

  public toISOStringFull = () => {
    const micro = this.getMicroseconds();
    const nano = this.getNanoseconds();
    return this._date.toISOString().replace('Z', `${pad(micro)}${pad(nano)}Z`);
  };

  public toGMTString = () => {
    console.warn('toGMTString is depricated. Use toUTCString() instead.');
    return this.toUTCString();
  };

  private setupFunctions = () => {
    this._date = new Date(this.valueOf());
  };

  private _getFullYear = (utc) => {
    return utc ? this.getUTCFullYear() : this.getFullYear();
  };

  private _getDate = (utc) => {
    return utc ? this.getUTCDate() : this.getDate();
  };

  private _getMonth = (utc) => {
    return utc ? this.getUTCMonth() : this.getMonth();
  };

  private _getDays = (unit, utc = false) => {
    const currentYear = new BigNumber(this._getFullYear(utc));
    let base = new BigNumber(unit);
    let res = new BigNumber(this._getDate(utc)).minus(1);
    if (unit >= 12) {
      const years = base.dividedToIntegerBy(12);
      const start = new BigNumber(currentYear);
      const end = start.plus(years);
      res = this.getDaysBetween(start, end, daysForYear);
      base = base.plus(years.times(12).times(base.isLessThan(0) ? 1 : -1));
    }

    const month = new BigNumber(this._getMonth(utc));
    let diff = month.plus(base);
    if (diff.isGreaterThan(11)) {
      diff = month.minus(base);
    }
    if (diff.isLessThan(month)) {
      return res.plus(
        this.getDaysBetween(diff, month, daysForMonth.bind(null, currentYear))
      );
    }
    return res.plus(
      this.getDaysBetween(month, diff, daysForMonth.bind(null, currentYear))
    );
  };

  private _toString = (funcName) => {
    const split = this._date[funcName]().split(' GMT');
    const milli = this.getMilliseconds();
    const micro = this.getMicroseconds();
    const nano = this.getNanoseconds();
    split[0] += `.${pad(milli)}${pad(micro)}${pad(nano)}`;
    return split.join(' GMT');
  };
}

export default NanoDate;
