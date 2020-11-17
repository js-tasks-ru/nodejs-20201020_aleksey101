const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, password, displayName} = ctx.request.body;
  let user = await User.findOne({email});
  if (user) {
    ctx.status = 400;
    ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };
    return next();
  }

  const verificationToken = uuid();
  user = new User({
    email,
    displayName,
    verificationToken,
  });
  await user.setPassword(password);
  await user.save();
  await ctx.login(user);
  await sendMail({
    to: user.email,
    subject: 'Успешная регистрация на моей приложеньке',
    template: 'confirmation',
    locals: {
      token: verificationToken,
    },
  });
  ctx.body = {
    status: 'ok',
  };
  return next();
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  if (!verificationToken) {
    ctx.throw(400, 'Пустой токен');
  }
  const user = await User.findOne({verificationToken});
  if (!user) {
    ctx.status = 400;
    ctx.body = {
      error: 'Ссылка подтверждения недействительна или устарела',
    };
    return next();
  }
  user.verificationToken = undefined;
  await user.save();
  const authToken = await ctx.login(user);
  ctx.body = {
    token: authToken,
  };
  return next();
};
