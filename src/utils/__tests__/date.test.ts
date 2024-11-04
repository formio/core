import { expect } from 'chai';
import { formatDate } from '../date';

describe('Test Date Utils', function () {
  it('Should format date without timezone correctly', function () {
    const value = '2023-04-01T12:00:00Z';
    const format = 'YYYY-MM-DD';
    const expected = '2023-04-01';
    expect(formatDate(value, format)).to.equal(expected);
  });

  it('Should format date in UTC timezone correctly', function () {
    const value = '2023-04-01T12:00:00Z';
    const format = 'YYYY-MM-DD HH:mm:ss';
    const timezone = 'UTC';
    const expected = '2023-04-01 12:00:00 UTC';
    expect(formatDate(value, format, timezone)).to.equal(expected);
  });

  it('Should format date in a specific timezone correctly', function () {
    const value = '2023-04-01T12:00:00Z';
    const format = 'YYYY-MM-DD HH:mm:ss';
    expect(formatDate(value, format, 'America/New_York')).to.equal('2023-04-01 08:00:00 EDT');
    // TODO: Fix expected value when dayjs issue is resolved
    // https://github.com/iamkun/dayjs/issues/1154
    // expect(formatDate(value, format, 'Europe/London')).to.equal('2023-04-01 13:00:00 BST');
    expect(formatDate(value, format, 'Europe/London')).to.equal('2023-04-01 13:00:00 GMT+1');
  });
});
