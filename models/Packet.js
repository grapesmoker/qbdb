module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Packet', {
    name : {type: DataTypes.TEXT, allowNull: false},
    packet_mongo: DataTypes.STRING
  });
}
