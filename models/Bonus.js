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
  }, {
    classMethods: {
      getSearchVector: function() {
        return 'BonusText';
      },
       search: function(query) {
         if(sequelize.options.dialect !== 'postgres') {
           console.log('Search is only implemented on POSTGRES database');
           return;
         }
         var Bonus = this;

         query = sequelize.getQueryInterface().escape(query);

         return sequelize
           .query('SELECT * FROM "'+Bonus.tableName+'" WHERE "' + Bonus.getSearchVector() + '" @@ plainto_tsquery(\'english\', ' + query + ') AND flagged=false LIMIT 50', Bonus); 

       }
    }
  });
}
