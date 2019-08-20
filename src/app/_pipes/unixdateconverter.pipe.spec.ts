import { UnixdateconverterPipe } from './unixdateconverter.pipe';

describe('CommonPipe', () => {
  it('create an instance', () => {
    const pipe = new UnixdateconverterPipe();
    expect(pipe).toBeTruthy();
  });

  it('try to convert', () => {
    const pipe = new UnixdateconverterPipe();
    const currentDate = Date.now();
    expect(pipe.transform(currentDate)).toBe(new Date(currentDate * 1000).toUTCString());
  });

});
