/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
/* eslint-disable prefer-spread */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Timestamp for 64-bit time_t, nanosecond precision and strftime
 *
 * @author Yusuke Kawasaki
 * @license MIT
 * @see https://github.com/kawanet/timestamp-nano
 */

const Timestamp = (function () {
  // if (typeof module !== 'undefined') module.exports = Timestamp;

  const SEC_DAY = 24 * 3600; // seconds per day
  const YEAR_SLOT = 3200; // years per slot
  const DAY_SLOT = ((365 * 400 + 97) * YEAR_SLOT) / 400; // days per slot
  const SEC_SLOT = SEC_DAY * DAY_SLOT; // seconds per slot
  const MSEC_SLOT = SEC_SLOT * 1000; // mseconds per slot

  // 15.9.1.1 Time Values and Time Range
  // The actual range of times supported by ECMAScript Date objects is
  // exactly –100,000,000 days to 100,000,000 days measured relative to
  // midnight at the beginning of 01 January, 1970 UTC.
  const MAX_MSEC = 1000 * 10000 * 10000 * SEC_DAY;

  const BIT24 = 0x1000000;
  const BIT32 = 0x10000 * 0x10000;
  const DEC6 = 1000 * 1000;
  const DEC9 = 1000 * 1000 * 1000;
  const ZERO9 = '000000000';

  const trunc = Math.trunc || Math_trunc;
  const P = Timestamp.prototype;

  // static methods
  Timestamp.fromDate = fromDate;
  Timestamp.fromInt64BE = buildFromInt64(0, 1, 2, 3, 0, 4);
  Timestamp.fromInt64LE = buildFromInt64(3, 2, 1, 0, 4, 0);
  Timestamp.fromString = fromString;
  Timestamp.fromTimeT = fromTimeT;

  // private properties
  P.year = 0; // Offset number for year precision
  P.time = 0; // Milliseconds from epoch
  P.nano = 0; // Offset number for nanosecond precision

  // instance methods
  P.addNano = addNano;
  P.getNano = getNano;
  P.getTimeT = getTimeT;
  P.getYear = getYear;
  P.toDate = toDate;
  P.toJSON = toJSON;
  P.toString = toString;
  P.writeInt64BE = buildWriteInt64(0, 1, 2, 3, 0, 4);
  P.writeInt64LE = buildWriteInt64(3, 2, 1, 0, 4, 0);

  const FMT_JSON = '%Y-%m-%dT%H:%M:%S.%NZ';

  const FMT_MONTH = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const FMT_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const FMT_STRING = {
    '%': '%',
    F: '%Y-%m-%d',
    n: '\n',
    R: '%H:%M',
    T: '%H:%M:%S',
    t: '\t',
    X: '%T',
    Z: 'GMT',
    z: '+0000',
  };

  return Timestamp;

  function Timestamp(time, nano, year) {
    const ts = this;
    if (!(ts instanceof Timestamp)) return new Timestamp(time, nano, year);
    ts.time = +time || 0;
    ts.nano = +nano || 0;
    ts.year = +year || 0;
    normalize(ts);
  }

  function getYear() {
    const year = this.toDate().getUTCFullYear();
    return year + this.year;
  }

  function normalize(ts) {
    let { year } = ts;
    let { time } = ts;
    let { nano } = ts;
    let changed;
    let slot;

    // normalize nano
    if (nano < 0 || DEC6 <= nano) {
      const n = Math.floor(nano / DEC6);
      nano -= n * DEC6;
      time += n;
      changed = 1;
    }

    const y = year % YEAR_SLOT;
    if (time < -MAX_MSEC || MAX_MSEC < time || y) {
      // shrink time into the minimal slot
      slot = trunc(time / MSEC_SLOT);
      if (slot) {
        year += slot * YEAR_SLOT;
        time -= slot * MSEC_SLOT;
      }

      // add year offset smaller than a slot
      const dt = newDate(time);
      dt.setUTCFullYear(y + dt.getUTCFullYear());
      year -= y;
      time = +dt;

      // use full range of 100 million days.
      slot = trunc(year / YEAR_SLOT);
      const total = time + slot * MSEC_SLOT;
      if (slot && -MAX_MSEC <= total && total <= MAX_MSEC) {
        year -= slot * YEAR_SLOT;
        time = total;
      }

      changed = 1;
    }

    if (changed) {
      ts.year = year;
      ts.time = time;
      ts.nano = nano;
    }

    return ts;
  }

  function toDate() {
    const ts = normalize(this);
    return newDate(ts.time);
  }

  function newDate(time) {
    const dt = new Date(0);
    dt.setTime(time);
    return dt;
  }

  function addNano(nano) {
    this.nano += +nano || 0;
    return this;
  }

  function getNano() {
    const ts = normalize(this);
    return ((ts.time % 1000) * DEC6 + +ts.nano + DEC9) % DEC9;
  }

  function fromString(string) {
    let time;
    const ts = new Timestamp();
    string += '';

    const array = string
      .replace(/^\s*[+\-]?\d+/, function (match) {
        const year = +match;
        // Use only years around 1970 to avoid Date's terrible behavior:
        // 15.9.4.3 Date.UTC
        // If y is not NaN and 0 <= y <= 99, then let yr be 1900+y
        const y = 1970 + ((year - 1970) % 400);
        ts.year = year - y;
        return y;
      })
      .replace(/(?:Z|([+\-]\d{2}):?(\d{2}))$/, function (match, hour, min) {
        // time zone
        if (hour < 0) min *= -1;
        time = (+hour * 60 + +min) * 60000;
        return '';
      })
      .replace(/\.\d+$/, function (match) {
        // nanoseconds
        ts.nano = +(match + ZERO9).substr(1, 9);
        return '';
      })
      .split(/\D+/);

    if (array.length > 1) {
      array[1]--; // month starts from 0
    } else {
      array[1] = 0;
    }

    ts.time = time = Date.UTC.apply(Date, array) - (time || 0);

    if (isNaN(time)) {
      throw new TypeError('Invalid Date');
    }

    return normalize(ts);
  }

  function fromDate(date) {
    return new Timestamp(+date);
  }

  function fromTimeT(time) {
    return fromTime(time, 0);
  }

  function fromTime(low, high) {
    high |= 0;
    high *= BIT32;
    low = +low || 0;

    // slot count
    let slot = trunc(high / SEC_SLOT) + trunc(low / SEC_SLOT);

    // seconds within slot
    let second = (high % SEC_SLOT) + (low % SEC_SLOT);

    // slot offset
    const offset = trunc(second / SEC_SLOT);
    if (offset) {
      slot += offset;
      second -= offset * SEC_SLOT;
    }

    return new Timestamp(second * 1000, 0, slot * YEAR_SLOT);
  }

  function getTimeT() {
    const ts = normalize(this);
    let time = Math.floor(ts.time / 1000);

    const { year } = ts;
    if (year) time += (year * DAY_SLOT * SEC_DAY) / YEAR_SLOT;

    // this may loose some bits over than 53 bit precision
    return time;
  }

  function toJSON() {
    return this.toString().replace(/0{1,6}Z$/, 'Z');
  }

  function toString(format) {
    const ts = this;
    const dt = ts.toDate();
    const map = {
      H,
      L,
      M,
      N,
      S,
      Y,
      a,
      b,
      d,
      e,
      m,
    };

    return strftime(format || FMT_JSON);

    function strftime(format) {
      return format.replace(/%./g, function (match) {
        const m = match[1];
        const c = FMT_STRING[m];
        const f = map[m];
        return c ? strftime(c) : f ? f() : match;
      });
    }

    function Y() {
      const year = ts.getYear();
      if (year > 999999) {
        return `+${year}`;
      }
      if (year > 9999) {
        return `+${pad(year, 6)}`;
      }
      if (year >= 0) {
        return pad(year, 4);
      }
      if (year >= -999999) {
        return `-${pad(-year, 6)}`;
      }
      return year;
    }

    function m() {
      return pad2(dt.getUTCMonth() + 1);
    }

    function d() {
      return pad2(dt.getUTCDate());
    }

    function e() {
      return padS(dt.getUTCDate());
    }

    function H() {
      return pad2(dt.getUTCHours());
    }

    function M() {
      return pad2(dt.getUTCMinutes());
    }

    function S() {
      return pad2(dt.getUTCSeconds());
    }

    function L() {
      return pad(dt.getUTCMilliseconds(), 3);
    }

    function N() {
      return pad(ts.getNano(), 9);
    }

    function a() {
      return FMT_DAY[dt.getUTCDay()];
    }

    function b() {
      return FMT_MONTH[dt.getUTCMonth()];
    }
  }

  function buildWriteInt64(pos0, pos1, pos2, pos3, posH, posL) {
    return writeInt64;

    function writeInt64(buffer, offset) {
      const ts = normalize(this);
      if (!buffer) buffer = new Array(8);
      checkRange(buffer, (offset |= 0));

      const second = Math.floor(ts.time / 1000);
      const day = ts.year * ((DAY_SLOT * SEC_DAY) / YEAR_SLOT);
      let high = trunc(day / BIT32) + trunc(second / BIT32);
      let low = (day % BIT32) + (second % BIT32);

      // slot offset
      const slot = Math.floor(low / BIT32);
      if (slot) {
        high += slot;
        low -= slot * BIT32;
      }

      writeUint32(buffer, offset + posH, high);
      writeUint32(buffer, offset + posL, low);
      return buffer;
    }

    function writeUint32(buffer, offset, value) {
      buffer[offset + pos0] = (value >> 24) & 255;
      buffer[offset + pos1] = (value >> 16) & 255;
      buffer[offset + pos2] = (value >> 8) & 255;
      buffer[offset + pos3] = value & 255;
    }
  }

  function buildFromInt64(pos0, pos1, pos2, pos3, posH, posL) {
    return fromInt64;

    function fromInt64(buffer, offset) {
      checkRange(buffer, (offset |= 0));
      const high = readUint32(buffer, offset + posH);
      const low = readUint32(buffer, offset + posL);
      return fromTime(low, high);
    }

    function readUint32(buffer, offset) {
      return (
        buffer[offset + pos0] * BIT24 +
        ((buffer[offset + pos1] << 16) |
          (buffer[offset + pos2] << 8) |
          buffer[offset + pos3])
      );
    }
  }

  function checkRange(buffer, offset) {
    const last = buffer && buffer.length;
    if (last == null) throw new TypeError('Invalid Buffer');
    if (last < offset + 8) throw new RangeError('Out of range');
  }

  function Math_trunc(x) {
    const n = x - (x % 1);
    return n === 0 && (x < 0 || (x === 0 && 1 / x !== 1 / 0)) ? -0 : n;
  }

  function padS(v) {
    return (v > 9 ? '' : ' ') + (v | 0);
  }

  function pad2(v) {
    return (v > 9 ? '' : '0') + (v | 0);
  }

  function pad(v, len) {
    return (ZERO9 + (v | 0)).substr(-len);
  }
})();
