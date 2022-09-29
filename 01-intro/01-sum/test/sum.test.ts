import sum from '../sum';
import {expect} from 'chai';

describe('intro/sum', () => {
  describe('функция sum', () => {
    it('складывает два числа', () => {
      expect(sum(1, 2)).to.equal(3);
    });

    [
      ['1', []],
      ['1', '1'],
      [1, '1'],
      ['1', 1],
    ].forEach(([a, b]) => {
      it('бросает TypeError, если аргументы - не числа', () => {
        // @ts-expect-error
        expect(() => sum(a, b)).throw(TypeError);
      });
    });
  });
});
