const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      try {
        const user = await User.findOne({email});
        if (!user) {
          done(null, false, 'Нет такого пользователя');
          return;
        }
        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) {
          done(null, false, 'Неверный пароль');
          return;
        }
        done(null, user, null);
      } catch (err) {
        done(err, false, null);
      }
    },
);
