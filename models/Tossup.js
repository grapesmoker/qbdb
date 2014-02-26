module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tossup', {
    question: {type: DataTypes.TEXT, required: true},
    answer: {type: DataTypes.TEXT, required: true},
    flagged: {type: DataTypes.BOOLEAN, required: true}
  }, {
    classMethods: {
      getSearchVector: function() {
        return 'TossupText';
      }, 
      
      addFullTextIndex: function() {
        if(sequelize.options.dialect !== 'postgres') {
          console.log('Not creating search index, must be using POSTGRES to do this');
          return;
        }

        var searchFields = ['question', 'answer'];
        var Tossup = this;

        var vectorName = Tossup.getSearchVector();
        sequelize
          .query('ALTER TABLE "' + Tossup.tableName + '" ADD COLUMN "' + vectorName + '" TSVECTOR')
          .success(function() {
            return sequelize
            .query('UPDATE "' + Tossup.tableName + '" SET "' + vectorName + '" = to_tsvector(\'english\', ' + searchFields.join(' || \' \' || ') + ')')
              .error(console.log);
              }).success(function() {
                return sequelize
                .query('CREATE INDEX post_search_idx ON "' + Tossup.tableName + '" USING gin("' + vectorName + '");')
                .error(console.log);
              }).success(function() {
                return sequelize
                .query('CREATE TRIGGER post_vector_update BEFORE INSERT OR UPDATE ON "' + Tossup.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.english\', ' + searchFields.join(', ') + ')')
                  .error(console.log);
                  }).error(console.log);

      },

      search: function(query) {
        if(sequelize.options.dialect !== 'postgres') {
          console.log('Search is only implemented on POSTGRES database');
          return;
        }

        var Tossup = this;

        query = sequelize.getQueryInterface().escape(query);

        return sequelize
          .query('SELECT * FROM "'+Tossup.tableName+'" WHERE "' + Tossup.getSearchVector() + '" @@ plainto_tsquery(\'english\', ' + query + ') AND flagged=false LIMIT 50', Tossup, {});
      }
    }
  });
};
