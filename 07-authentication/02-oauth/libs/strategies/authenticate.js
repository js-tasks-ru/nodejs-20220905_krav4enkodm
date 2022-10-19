const User = require('../../models/User');

module.exports = async function authenticate(
  strategy,
  email,
  displayName,
  done
) {
  if (!email) {
    return done(null, null, 'Не указан email');
  }

  const user = await User.findOne({email});

  if (!user) {
    try {
      const newUser = await User.create({email, displayName});
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }

  return done(null, user);
};
