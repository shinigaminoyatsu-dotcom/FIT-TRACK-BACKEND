const bcrypt = require('bcryptjs');

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);

module.exports = { hashPassword, comparePassword };
