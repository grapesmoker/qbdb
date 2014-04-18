module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tournament', {
    name : DataTypes.TEXT,
    difficulty: DataTypes.INTEGER,
    power: DataTypes.BOOLEAN,
    year: DataTypes.INTEGER,
    tournament_mongo: DataTypes.STRING,
  }, {timestamps: false});
}
