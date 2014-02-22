module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Subject', {
    subject: DataTypes.STRING
  });
}
