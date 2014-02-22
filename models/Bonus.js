module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Bonus', {
    leadin: DataTypes.TEXT,
    part1: DataTypes.TEXT,
    answer1: DataTypes.TEXT,
    part2: DataTypes.TEXT,
    answer2: DataTypes.TEXT,
    part3: DataTypes.TEXT,
    answer3: DataTypes.TEXT,
    flagged: DataTypes.BOOLEAN
  });
}
