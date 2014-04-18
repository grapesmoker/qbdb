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

        var searchFields = {'A': ['question'], 'B': ['answer']};
        var Tossup = this;
        var searchVector = [];
        
        Object.keys(searchFields).forEach(function(key) {
          searchFields[key].forEach(function(e) {
            searchVector.push("setweight(to_tsvector('english', coalesce("+e+",'')), '"+key+"')");
          });
        });
        searchVector = searchVector.join(' || ');

        var vectorName = Tossup.getSearchVector();
        sequelize
          .query('ALTER TABLE "' + Tossup.tableName + '" ADD COLUMN "' + vectorName + '" TSVECTOR')
          .success(function() {
            return sequelize
              .query('UPDATE "' + Tossup.tableName + '" SET "' + vectorName + '" = '+searchVector)
              .error(console.log);
          }).success(function() {
            return sequelize
              .query('CREATE INDEX tossup_search_idx ON "' + Tossup.tableName + '" USING gin("' + vectorName + '");')
              .error(console.log);
          }).success(function() {
            return sequelize
              //TODO: clean this up
              .query('CREATE TRIGGER tossup_vector_update BEFORE INSERT OR UPDATE ON "' + Tossup.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.english\', ' + Object.keys(searchFields).map(function(key) { return searchFields[key]}).join(', ') + ')')
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
          // I don't even give
          // TODO: Begin to give
          .query('SELECT ts_rank(ARRAY[0, 0, 0.8, 0.4], "TossupText", query) AS rank, "Tossups".*, "Subject"."id" AS "subject.id", "Subject"."subject" AS "subject.subject", "Subject"."createdAt" AS "subject.createdAt", "Subject"."updatedAt" AS "subject.updatedAt", "Packet"."id" AS "packet.id", "Packet"."name" AS "packet.name", "Packet"."packet_mongo" AS "packet.packet_mongo", "Packet"."createdAt" AS "packet.createdAt", "Packet"."updatedAt" AS "packet.updatedAt", "Packet"."TournamentId" AS "packet.TournamentId", "packet.Tournament"."id" AS "packet.tournament.id", "packet.Tournament"."name" AS "packet.tournament.name", "packet.Tournament"."difficulty" AS "packet.tournament.difficulty", "packet.Tournament"."power" AS "packet.tournament.power", "packet.Tournament"."year" AS "packet.tournament.year", "packet.Tournament"."tournament_mongo" AS "packet.tournament.tournament_mongo" FROM plainto_tsquery(\'english\', ' + query + ') query, "Tossups" LEFT OUTER JOIN "Subjects" AS "Subject" ON "Subject"."id" = "Tossups"."SubjectId" LEFT OUTER JOIN "Packets" AS "Packet" ON "Packet"."id" = "Tossups"."PacketId" LEFT OUTER JOIN "Tournaments" AS "packet.Tournament" ON "packet.Tournament"."id" = "Packet"."TournamentId" WHERE "' + Tossup.getSearchVector() +'" @@ query AND flagged=false ORDER BY rank DESC LIMIT 50', null, {raw: true}); 
      }
    }
  });
};
