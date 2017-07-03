# Nano Date

![Downloads](https://img.shields.io/npm/dm/nano-date.svg)
![Downloads](https://img.shields.io/npm/dt/nano-date.svg)
![npm version](https://img.shields.io/npm/v/nano-date.svg)
![dependencies](https://img.shields.io/david/jcgertig/nano-date.svg)
![dev dependencies](https://img.shields.io/david/dev/jcgertig/nano-date.svg)
![License](https://img.shields.io/npm/l/nano-date.svg)

__Date class that supports up to nano seconds__

All of the normal date class functions with a few addtions.

If you pass a number in the constructor it will assume milliseconds however if
you pass in a string of numbers it will assume nanoseconds.

```javascript
const upToMillisecondPrecision  = new NanoDate(1497290225089); // assumes milliseconds
const upToMicrosecondPrecision  = new NanoDate(1497290225089.999); // assumes milliseconds
const upToNanosecondPrecision = new NanoDate('1497290225089999999'); // assumes nanoseconds
```

Extra available methods.

- `getMicroseconds`
```javascript
nanoDate.getMicroseconds(); // 0 - 999
```

- `getNanoseconds`
```javascript
nanoDate.getNanoseconds(); // 0 - 999
```

- `setMicroseconds` - returns the microseconds value
```javascript
nanoDate.setMicroseconds(25); // 25
```

- `setNanoseconds` - returns the nanoseconds value
```javascript
nanoDate.setNanoseconds(25); // 25
```

- `toString` && `toUTCString` - adds millisecond, microsecond, nanosecond as a decimal to the seconds
```javascript
nanoDate.toString(); // ie "Mon Jun 12 2017 12:57:05.089999999 GMT-0500 (CDT)"
```

- `valueOf` && `NanoDate.now()` - returns a integer of millisecond precision

- `valueOfWithMicro` - returns a float with microsecond precision
```javascript
nanoDate.valueOfWithMicro(); // 1497290225089.999
```

- `valueOfWithNano` - returns a float in a string with nanosecond precision
```javascript
nanoDate.valueOfWithNano(); // "1497290225089.999999"
```

- `getTime` - returns a string in nanoseconds
```javascript
nanoDate.getTime(); // "1497290225089999999"
```
