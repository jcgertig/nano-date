import NanoDate from './index.js';

test('test parsing date simple with nanoseconds', () => {

	let date = NanoDate.parseISO("2017-08-17T17:04:35.160744338Z")
	expect(date.getNanoseconds()).toBe(338);
	expect(date.getMicroseconds()).toBe(744);
	expect(date.getMilliseconds()).toBe(160);
	expect(date.valueOfWithNano()).toBe("1502989475160.744338");
	expect(date.getTime()).toBe("1502989475160744338")
})