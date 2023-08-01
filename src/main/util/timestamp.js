/* eslint-disable no-useless-escape */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
/* eslint-disable prefer-spread */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */
/* eslint-disable no-multi-assign */
/* eslint-disable func-names */

/**
 * Timestamp for 64-bit time_t, nanosecond precision and strftime
 *
 * @author Yusuke Kawasaki
 * @license MIT
 * @see https://github.com/kawanet/timestamp-nano
 */

const { trunc } = Math;

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

const DEC6 = 1000 * 1000;
const ZERO9 = '000000000';

function newDate(time) {
  const dt = new Date(0);
  dt.setTime(time);
  return dt;
}

const normalize = (ts) => {
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
};

function Timestamp(time, nano, year) {
  const ts = {};
  ts.time = +time || 0;
  ts.nano = +nano || 0;
  ts.year = +year || 0;
  normalize(ts);
}

/**
 * Returns a UTC timestamp in milliseconds
 * @param {nanoTimestamp} string
 * @returns
 */
export const timestampFromString = (string) => {
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

  return normalize(ts).time;
};
