import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import bodyparser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

app.use(serve(path.join(__dirname, 'public')));
app.use(bodyparser());

const stack: Koa.ParameterizedContext[] = [];

router.get('/subscribe', async (ctx) => {
  await new Promise((resolve) => {
    // @ts-expect-error
    ctx.resolve = resolve;
    stack.push(ctx);
  });
});

router.post('/publish', async (ctx, next) => {
  const {body} = ctx.request;
  if (body && 'message' in body) {
    ctx.status = 200;
    ctx.body = 'ok';

    while (stack.length) {
      const subscriber = stack.pop()!;
      subscriber.status = 200;
      subscriber.body = body.message;
      subscriber.resolve();
    }
  }
});

app.use(router.routes());

export default app;
