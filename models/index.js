var Sequelize = require('sequelize')
  //, config = require('config').Database
  , config = {name: 'qbdb', user: 'arnav', pass: 'psql', options: {host: 'localhost', port: 5432, dialect: 'postgres', omitNull: true}}
  , path = require('path')
  , postgres  = require('sequelize-postgres').postgres
  , sequelize = new Sequelize(config.name, config.user, config.pass, config.options);

var models = ['Tournament', 'Packet', 'Subject', 'Tossup', 'Bonus'];

models.forEach(function(model) {
  var m = sequelize.import(path.join(__dirname, model));
  module.exports[model] = m;
});

(function(m){
  m.Tournament.hasMany(m.Packet);
  m.Packet.belongsTo(m.Tournament);

  m.Packet.hasMany(m.Tossup);
  m.Tossup.belongsTo(m.Packet);
  
  m.Subject.hasMany(m.Tossup);
  m.Tossup.belongsTo(m.Subject);

  m.Packet.hasMany(m.Bonus);
  m.Bonus.belongsTo(m.Packet);
  
  m.Subject.hasMany(m.Bonus);
  m.Bonus.belongsTo(m.Subject);
})(module.exports);

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;
