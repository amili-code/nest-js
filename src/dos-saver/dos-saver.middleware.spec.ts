import { DosSaverMiddleware } from './dos-saver.middleware';

describe('DosSaverMiddleware', () => {
  it('should be defined', () => {
    expect(new DosSaverMiddleware()).toBeDefined();
  });
});
