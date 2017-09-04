import NanoDate from './index.js';

/*
 * Test basic string parsing
 */
test('test parsing date in basic format', () => {
  let date = new NanoDate('2017-01-01');
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCDate()).toBe(1);
});

/*
 * Test basic string parsing
 */
test('test parsing empty', () => {
  let date = new NanoDate();
  let baseDate = new Date();
  expect(date.getUTCFullYear()).toBe(baseDate.getUTCFullYear());
  expect(date.getUTCMonth()).toBe(baseDate.getUTCMonth());
  expect(date.getUTCDate()).toBe(baseDate.getUTCDate());
});

/*
 * Test parsing from nano date
 */
test('test parsing from nano date', () => {
  let date = new NanoDate('2017-01-01');
  let date2 = new NanoDate(date);
  expect(date2.getUTCFullYear()).toBe(2017);
  expect(date2.getUTCMonth()).toBe(0);
  expect(date2.getUTCDate()).toBe(1);
});

/*
 * Test parsing from date
 */
test('test parsing from date', () => {
  let date = new NanoDate(new Date('2017-01-01'));
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCDate()).toBe(1);
});

/*
 * Test parsing from milliseconds
 */
test('test parsing from milliseconds', () => {
  let date = new NanoDate(new Date('2017-01-01').valueOf());
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCDate()).toBe(1);
});

/*
 * Test parsing from microseconds
 */
test('test parsing from microseconds', () => {
  const base = new Date('2017-01-01').valueOf() + 0.1;
  let date = new NanoDate(base);
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCDate()).toBe(1);
  expect(date.getUTCMicroseconds()).toBe(100);
});

/*
 * Test parsing from nanoseconds
 */
test('test parsing from nanoseconds', () => {
  const base = `${new Date('2017-01-01').valueOf()}000100`;
  let date = new NanoDate(base);
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCNanoseconds()).toBe(100);
});

/*
 * Test parsing from unknown type
 */
test('test parsing from unknown type', () => {
  let date;
  try {
    date = new NanoDate({});
  } catch (e) {
    expect(e.toString()).toBe('Error: Input not of any type that can be converted to a date');
  }
});

/*
 * Test parsing from each input
 */
test('test parsing from year and month and day', () => {
  let date = new NanoDate(2017, 1, 1);
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCDate()).toBe(1);
});

/*
 * Test ISO 8601 parsing
 */
test('test parsing date in iso 8601 with milliseconds', () => {
  let date = new NanoDate('2017-08-17T17:04:35.160Z');
  expect(date.getNanoseconds()).toBe(0);
  expect(date.getMicroseconds()).toBe(0);
  expect(date.getMilliseconds()).toBe(160);
  expect(date.valueOfWithNano()).toBe('1502989475160.000000');
  expect(date.getTime()).toBe('1502989475160000000');
});

test('test parsing date in iso 8601 with microseconds', () => {
  let date = new NanoDate('2017-08-17T17:04:35.160744Z');
  expect(date.getNanoseconds()).toBe(0);
  expect(date.getMicroseconds()).toBe(744);
  expect(date.getMilliseconds()).toBe(160);
  expect(date.valueOfWithNano()).toBe('1502989475160.744000');
  expect(date.getTime()).toBe('1502989475160744000');
});

test('test parsing date in iso 8601 with nanoseconds', () => {
  let date = new NanoDate('2017-08-17T17:04:35.160744338Z');
  expect(date.getNanoseconds()).toBe(338);
  expect(date.getMicroseconds()).toBe(744);
  expect(date.getMilliseconds()).toBe(160);
  expect(date.valueOfWithNano()).toBe('1502989475160.744338');
  expect(date.getTime()).toBe('1502989475160744338');
});

/*
 * Test setUTCFullYear
 */
test('test setUTCFullYear basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCFullYear()).toBe(2017);
  date.setUTCFullYear(2015);
  expect(date.getUTCFullYear()).toBe(2015);
});

/*
 * Test setFullYear
 */
test('test setFullYear basic', () => {
  let date = new NanoDate('2017-02-01T00:00:00.00Z');
  expect(date.getFullYear()).toBe(2017);
  date.setFullYear(2015);
  expect(date.getFullYear()).toBe(2015);
});

/*
 * Test setUTCMonth
 */
test('test setUTCMonth basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMonth()).toBe(0);
  date.setUTCMonth(2);
  expect(date.getUTCMonth()).toBe(2);
});

test('test setUTCMonth basic with overflow', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCMonth()).toBe(0);
  date.setUTCMonth(12);
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCFullYear()).toBe(2018);
});

test('test setUTCMonth basic with date', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCDate()).toBe(1);
  date.setUTCMonth(2, 3);
  expect(date.getUTCMonth()).toBe(2);
  expect(date.getUTCDate()).toBe(3);
});

/*
 * Test setMonth
 */
test('test setMonth basic - 0', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(0);
  expect(date.getMonth()).toBe(0);
});

test('test setMonth basic - 1', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(1);
  expect(date.getMonth()).toBe(1);
});

test('test setMonth basic - 2', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(2);
  expect(date.getMonth()).toBe(2);
});

test('test setMonth basic - 3', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(3);
  expect(date.getMonth()).toBe(3);
});

test('test setMonth basic - 4', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(4);
  expect(date.getMonth()).toBe(4);
});

test('test setMonth basic - 5', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(5);
  expect(date.getMonth()).toBe(5);
});

test('test setMonth basic - 6', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(6);
  expect(date.getMonth()).toBe(6);
});

test('test setMonth basic - 7', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(7);
  expect(date.getMonth()).toBe(7);
});

test('test setMonth basic - 8', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(8);
  expect(date.getMonth()).toBe(8);
});

test('test setMonth basic - 9', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(9);
  expect(date.getMonth()).toBe(9);
});

test('test setMonth basic - 10', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(10);
  expect(date.getMonth()).toBe(10);
});

test('test setMonth basic - 11', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setMonth(11);
  expect(date.getMonth()).toBe(11);
});

test('test setMonth basic - 12', () => {
  let date = new NanoDate('2017-01-05T00:00:00.00Z');
  date.setMonth(12);
  expect(date.getMonth()).toBe(0);
});

test('test setMonth basic - 13', () => {
  let date = new NanoDate('2017-01-05T00:00:00.00Z');
  date.setMonth(13);
  expect(date.getMonth()).toBe(1);
});
/*
 * Test setUTCDate
 */
test('test setUTCDate basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCDate()).toBe(1);
  date.setUTCDate(10);
  expect(date.getUTCDate()).toBe(10);
});

test('test setUTCDate basic with overflow', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCDate()).toBe(1);
  date.setUTCDate(32);
  expect(date.getUTCMonth()).toBe(1);
  expect(date.getUTCDate()).toBe(1);
});

/*
 * Test setDate
 */
test('test setDate basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setDate(10);
  expect(date.getDate()).toBe(10);
});

/*
 * Test setUTCHours
 */
test('test setUTCHours basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCHours()).toBe(0);
  date.setUTCHours(10);
  expect(date.getUTCHours()).toBe(10);
});

test('test setUTCHours with overflow', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCDay()).toBe(0);
  expect(date.getUTCHours()).toBe(0);
  date.setUTCHours(25);
  expect(date.getUTCDay()).toBe(1);
  expect(date.getUTCHours()).toBe(1);
});

test('test setUTCHours basic with minutes', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCHours()).toBe(0);
  date.setUTCHours(1, 2);
  expect(date.getUTCHours()).toBe(1);
  expect(date.getUTCMinutes()).toBe(2);
});

test('test setUTCHours basic with seconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCHours()).toBe(0);
  date.setUTCHours(1, 2, 3);
  expect(date.getUTCHours()).toBe(1);
  expect(date.getUTCMinutes()).toBe(2);
  expect(date.getUTCSeconds()).toBe(3);
});

test('test setUTCHours basic with milliseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCHours()).toBe(0);
  date.setUTCHours(1, 2, 3, 4);
  expect(date.getUTCHours()).toBe(1);
  expect(date.getUTCMinutes()).toBe(2);
  expect(date.getUTCSeconds()).toBe(3);
  expect(date.getUTCMilliseconds()).toBe(4);
});

test('test setUTCHours basic with microseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCHours()).toBe(0);
  date.setUTCHours(1, 2, 3, 4, 5);
  expect(date.getUTCHours()).toBe(1);
  expect(date.getUTCMinutes()).toBe(2);
  expect(date.getUTCSeconds()).toBe(3);
  expect(date.getUTCMilliseconds()).toBe(4);
  expect(date.getUTCMicroseconds()).toBe(5);
});

test('test setUTCHours basic with nanoseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCHours()).toBe(0);
  date.setUTCHours(1, 2, 3, 4, 5, 6);
  expect(date.getUTCHours()).toBe(1);
  expect(date.getUTCMinutes()).toBe(2);
  expect(date.getUTCSeconds()).toBe(3);
  expect(date.getUTCMilliseconds()).toBe(4);
  expect(date.getUTCMicroseconds()).toBe(5);
  expect(date.getUTCNanoseconds()).toBe(6);
});

/*
 * Test setHours
 */
test('test setHours basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  date.setHours(10);
  expect(date.getHours()).toBe(10);
});


/*
 * Test setUTCMinutes
 */
test('test setUTCMinutes basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMinutes()).toBe(0);
  date.setUTCMinutes(45);
  expect(date.getUTCMinutes()).toBe(45);
});

test('test setUTCMinutes with overflow', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMinutes()).toBe(0);
  expect(date.getUTCHours()).toBe(0);
  date.setUTCMinutes(65);
  expect(date.getUTCHours()).toBe(1);
  expect(date.getUTCMinutes()).toBe(5);
});

test('test setUTCMinutes basic with seconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMinutes()).toBe(0);
  date.setUTCMinutes(1, 2);
  expect(date.getUTCMinutes()).toBe(1);
  expect(date.getUTCSeconds()).toBe(2);
});

test('test setUTCMinutes basic with milliseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMinutes()).toBe(0);
  date.setUTCMinutes(1, 2, 3);
  expect(date.getUTCMinutes()).toBe(1);
  expect(date.getUTCSeconds()).toBe(2);
  expect(date.getUTCMilliseconds()).toBe(3);
});

test('test setUTCMinutes basic with microseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMinutes()).toBe(0);
  date.setUTCMinutes(1, 2, 3, 4);
  expect(date.getUTCMinutes()).toBe(1);
  expect(date.getUTCSeconds()).toBe(2);
  expect(date.getUTCMilliseconds()).toBe(3);
  expect(date.getUTCMicroseconds()).toBe(4);
});

test('test setUTCMinutes basic with nanoseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMinutes()).toBe(0);
  date.setUTCMinutes(1, 2, 3, 4, 5);
  expect(date.getUTCMinutes()).toBe(1);
  expect(date.getUTCSeconds()).toBe(2);
  expect(date.getUTCMilliseconds()).toBe(3);
  expect(date.getUTCMicroseconds()).toBe(4);
  expect(date.getUTCNanoseconds()).toBe(5);
});

/*
 * Test setUTCSeconds
 */
test('test setUTCSeconds basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCSeconds()).toBe(0);
  date.setUTCSeconds(45);
  expect(date.getUTCSeconds()).toBe(45);
});

test('test setUTCSeconds with overflow', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCSeconds()).toBe(0);
  expect(date.getUTCMinutes()).toBe(0);
  date.setUTCSeconds(65);
  expect(date.getUTCMinutes()).toBe(1);
  expect(date.getUTCSeconds()).toBe(5);
});

test('test setUTCSeconds basic with milliseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCSeconds()).toBe(0);
  date.setUTCSeconds(1, 2);
  expect(date.getUTCSeconds()).toBe(1);
  expect(date.getUTCMilliseconds()).toBe(2);
});

test('test setUTCSeconds basic with microseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCSeconds()).toBe(0);
  date.setUTCSeconds(1, 2, 3);
  expect(date.getUTCSeconds()).toBe(1);
  expect(date.getUTCMilliseconds()).toBe(2);
  expect(date.getUTCMicroseconds()).toBe(3);
});

test('test setUTCSeconds basic with nanoseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCSeconds()).toBe(0);
  date.setUTCSeconds(1, 2, 3, 4);
  expect(date.getUTCSeconds()).toBe(1);
  expect(date.getUTCMilliseconds()).toBe(2);
  expect(date.getUTCMicroseconds()).toBe(3);
  expect(date.getUTCNanoseconds()).toBe(4);
});

/*
 * Test setUTCMilliseconds
 */
test('test setUTCMilliseconds basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMilliseconds()).toBe(0);
  date.setUTCMilliseconds(45);
  expect(date.getUTCMilliseconds()).toBe(45);
});

test('test setUTCMilliseconds with overflow', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMilliseconds()).toBe(0);
  expect(date.getUTCSeconds()).toBe(0);
  date.setUTCMilliseconds(1005);
  expect(date.getUTCSeconds()).toBe(1);
  expect(date.getUTCMilliseconds()).toBe(5);
});

test('test setUTCMilliseconds basic with microseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMilliseconds()).toBe(0);
  date.setUTCMilliseconds(1, 2);
  expect(date.getUTCMilliseconds()).toBe(1);
  expect(date.getUTCMicroseconds()).toBe(2);
});

test('test setUTCMilliseconds basic with nanoseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMilliseconds()).toBe(0);
  date.setUTCMilliseconds(1, 2, 3);
  expect(date.getUTCMilliseconds()).toBe(1);
  expect(date.getUTCMicroseconds()).toBe(2);
  expect(date.getUTCNanoseconds()).toBe(3);
});

/*
 * Test setUTCMicroseconds
 */
test('test setUTCMicroseconds basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMicroseconds()).toBe(0);
  date.setUTCMicroseconds(45);
  expect(date.getUTCMicroseconds()).toBe(45);
});

test('test setUTCMicroseconds with overflow', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMicroseconds()).toBe(0);
  expect(date.getUTCMilliseconds()).toBe(0);
  date.setUTCMicroseconds(1005);
  expect(date.getUTCMilliseconds()).toBe(1);
  expect(date.getUTCMicroseconds()).toBe(5);
});

test('test setUTCMicroseconds basic with nanoseconds', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCMicroseconds()).toBe(0);
  date.setUTCMicroseconds(1, 2);
  expect(date.getUTCMicroseconds()).toBe(1);
  expect(date.getUTCNanoseconds()).toBe(2);
});

/*
 * Test setUTCNanoseconds
 */
test('test setUTCNanoseconds basic', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCNanoseconds()).toBe(0);
  date.setUTCNanoseconds(45);
  expect(date.getUTCNanoseconds()).toBe(45);
});

test('test setUTCNanoseconds with overflow', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCNanoseconds()).toBe(0);
  expect(date.getUTCMicroseconds()).toBe(0);
  date.setUTCNanoseconds(1005);
  expect(date.getUTCMicroseconds()).toBe(1);
  expect(date.getUTCNanoseconds()).toBe(5);
});

/*
 * Test now
 */
test('test now', () => {
  let nanoDate = `${NanoDate.now()}`;
  let date = `${Date.now()}`;
  expect(nanoDate.slice(0, nanoDate.length - 2)).toBe(date.slice(0, date.length - 2));
});

/*
 * Test UTC
 */
test('test UTC', () => {
  let nanoDate = NanoDate.UTC(2017, 1, 1);
  expect(nanoDate.getUTCFullYear()).toBe(2017);
  expect(nanoDate.getUTCMonth()).toBe(1);
  expect(nanoDate.getUTCDate()).toBe(1);
});

/*
 * Test parse
 */
test('test parse', () => {
  let milli = NanoDate.parse('Wed, 09 Aug 1995 00:00:00 GMT');
  expect(milli).toBe(807926400000);
});

/*
 * Test setTime
 */
test('test setTime', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCDate()).toBe(1);
  expect(date.getUTCNanoseconds()).toBe(0);
  date.setTime(`${new Date('2017-01-01').valueOf()}000100`);
  expect(date.getUTCNanoseconds()).toBe(100);
});

test('test setTime with extra digets', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCDate()).toBe(1);
  expect(date.getUTCNanoseconds()).toBe(0);
  date.setTime(`${new Date('2017-01-01').valueOf()}000100111`);
  expect(date.getUTCNanoseconds()).toBe(100);
});

/*
 * Test setUTCTime
 */
test('test setUTCTime', () => {
  let date = new NanoDate('2017-01-01T00:00:00.00Z');
  expect(date.getUTCFullYear()).toBe(2017);
  expect(date.getUTCMonth()).toBe(0);
  expect(date.getUTCDate()).toBe(1);
  expect(date.getUTCNanoseconds()).toBe(0);
  date.setUTCTime(`${new Date('2017-01-01').valueOf()}000100`);
  expect(date.getUTCNanoseconds()).toBe(100);
});

/*
 * Test toString
 */
test('test toString', () => {
  let date = new NanoDate(`${new Date('2017-01-01').valueOf()}000100`);
  const split = new Date('2017-01-01').toString().split(' GMT');
  split[0] += `.000000100`;
  expect(date.toString()).toBe(split.join(' GMT'));
});

/*
 * Test toUTCString
 */
test('test toUTCString', () => {
  let date = new NanoDate(`${new Date('2017-01-01').valueOf()}000100`);
  expect(date.toUTCString()).toBe('Sun, 01 Jan 2017 00:00:00.000000100 GMT');
});

/*
 * Test toGMTString
 */
test('test toGMTString', () => {
  let date = new NanoDate(`${new Date('2017-01-01').valueOf()}000100`);
  expect(date.toGMTString()).toBe('Sun, 01 Jan 2017 00:00:00.000000100 GMT');
});

/*
 * Test not an integer handeling
 */
test('test catch not an integer', () => {
  let date = new NanoDate(`${new Date('2017-01-01').valueOf()}000100`);
  try {
    date.setUTCNanoseconds('200');
  } catch (e) {
    expect(e.toString()).toBe('Error: Parameter nanosecond value for setNanoseconds has to be an integer.');
  }
});
