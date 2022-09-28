'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
Object.defineProperty(exports, '__esModule', {value: true});
const LimitSizeStream_1 = __importDefault(require('../LimitSizeStream'));
const LimitExceededError_1 = __importDefault(require('../LimitExceededError'));
const chai_1 = require('chai');
const sinon_1 = __importDefault(require('sinon'));
describe('streams/limit-size-stream', () => {
  describe('LimitSizeStream', () => {
    it('стрим передает поступающие данные без изменений', (done) => {
      const limitStream = new LimitSizeStream_1.default({
        limit: 3,
        encoding: 'utf-8',
      });
      const onData = sinon_1.default.spy();
      limitStream.on('data', onData);
      limitStream.on('end', () => {
        (0, chai_1.expect)(
          onData.calledTwice,
          `событие 'data' должно произойти 2 раза`
        ).to.be.true;
        (0, chai_1.expect)(
          onData.firstCall.args[0],
          `при первом вызове события 'data' в обработчик должна быть передана строка 'a'`
        ).to.equal('a');
        (0, chai_1.expect)(
          onData.secondCall.args[0],
          `при втором вызове события 'data' в обработчик должна быть передана строка 'b'`
        ).to.equal('b');
        done();
      });
      limitStream.write('a');
      limitStream.write('b');
      limitStream.end();
    });
    it('при превышении лимита выбрасывается ошибка', (done) => {
      const limitStream = new LimitSizeStream_1.default({
        limit: 2,
        encoding: 'utf-8',
      });
      const onData = sinon_1.default.spy();
      limitStream.on('data', onData);
      limitStream.on('error', (err) => {
        (0, chai_1.expect)(err).to.be.instanceOf(LimitExceededError_1.default);
        (0, chai_1.expect)(
          onData.calledTwice,
          `событие 'data' должно произойти только 2 раза`
        ).to.be.true;
        (0, chai_1.expect)(
          onData.firstCall.args[0],
          `при первом вызове события 'data' в обработчик должна быть передана строка 'a'`
        ).to.equal('a');
        (0, chai_1.expect)(
          onData.secondCall.args[0],
          `при втором вызове события 'data' в обработчик должна быть передана строка 'b'`
        ).to.equal('b');
        done();
      });
      limitStream.on('close', () => {
        (0, chai_1.expect)(
          limitStream.readableEnded,
          `стрим должен выбросить ошибку используя событие 'error'`
        ).to.be.false;
      });
      limitStream.write('a');
      limitStream.write('b');
      limitStream.end('c');
    });
    it('при проверке лимита должно учитываться количество байт, а не символов', (done) => {
      const smile = '😀';
      const limitStream = new LimitSizeStream_1.default({
        limit: Buffer.from(smile).length * 2 + 1,
        encoding: 'utf-8',
      });
      const onData = sinon_1.default.spy();
      limitStream.on('data', onData);
      limitStream.on('error', (err) => {
        (0, chai_1.expect)(err).to.be.instanceOf(LimitExceededError_1.default);
        (0, chai_1.expect)(
          onData.calledTwice,
          `событие 'data' должно произойти только 2 раза`
        ).to.be.true;
        (0, chai_1.expect)(
          onData.firstCall.args[0],
          `при первом вызове события 'data' в обработчик должна быть передана строка '😀'`
        ).to.equal(smile);
        (0, chai_1.expect)(
          onData.secondCall.args[0],
          `при втором вызове события 'data' в обработчик должна быть передана строка '😀'`
        ).to.equal(smile);
        done();
      });
      limitStream.on('close', () => {
        (0, chai_1.expect)(
          limitStream.readableEnded,
          `стрим должен выбросить ошибку используя событие 'error', 
          возможно подсчет байт происходит неверно`
        ).to.be.false;
      });
      limitStream.write(smile);
      limitStream.write(smile);
      limitStream.end(smile);
    });
  });
});
