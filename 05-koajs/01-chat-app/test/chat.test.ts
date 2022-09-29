import axios from 'axios';
import app from '../app';
import {expect} from 'chai';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('koajs/chat-app', () => {
  describe('тесты на чат', () => {
    let server: any;

    before((done) => {
      server = app.listen(3000, done);
    });

    after((done) => {
      server.close(done);
    });

    describe('POST /publish', () => {
      it('сообщение должно быть доставлено всем подписчикам', async () => {
        const message = 'text';

        const subscribers = Promise.all([
          axios.get('http://127.0.0.1:3000/subscribe', {
            timeout: 500,
          }),
          axios.get('http://127.0.0.1:3000/subscribe', {
            timeout: 500,
          }),
        ]);

        await sleep(50);

        await axios.post('http://127.0.0.1:3000/publish', {
          message,
        });

        const messages = await subscribers;

        messages.forEach((response) => {
          expect(
            response.data,
            'каждый подписчик должен получить исходное сообщение'
          ).to.equal(message);
        });
      });

      it('если нет сообщения - запрос должен игнорироваться', async () => {
        const message = 'text';

        const subscribers = Promise.all([
          axios.get('http://127.0.0.1:3000/subscribe', {
            timeout: 500,
          }),
          axios.get('http://127.0.0.1:3000/subscribe', {
            timeout: 500,
          }),
        ]);

        await sleep(50);

        await axios.post(
          'http://127.0.0.1:3000/publish',
          {},
          {
            validateStatus: () => true,
          }
        );

        await sleep(50);

        await axios.post('http://127.0.0.1:3000/publish', {
          message,
        });

        const messages = await subscribers;

        messages.forEach((response) => {
          expect(
            response.data,
            'каждый подписчик должен получить исходное сообщение'
          ).to.equal(message);
        });
      });
    });
  });
});
