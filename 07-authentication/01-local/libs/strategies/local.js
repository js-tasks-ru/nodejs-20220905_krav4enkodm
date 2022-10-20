const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  {usernameField: 'email', session: false},
  async function (email, password, done) {
    const user = await User.findOne({email});

    if (!user) {
      return done(null, null, 'Нет такого пользователя');
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      return done(null, null, 'Неверный пароль');
    }

    return done(null, user);
  }
);
