const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const router = new Router();
const requestCallbacks = new Set();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    requestCallbacks.add(resolve);

    ctx.req.on('close', () => {
      requestCallbacks.delete(resolve);
    });
  });

  return next();
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.throw(400, 'message is required');
  }

  requestCallbacks.forEach((resolve) => {
    resolve(message);
  });

  requestCallbacks.clear();
  ctx.body = 'message sent';
});

app.use(router.routes());

module.exports = app;
