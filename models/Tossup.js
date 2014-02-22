module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tossup', {
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    flagged: DataTypes.BOOLEAN,
  });
};
