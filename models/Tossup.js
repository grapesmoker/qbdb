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
          .query('SELECT "Tossups".*, "Subject"."id" AS "subject.id", "Subject"."subject" AS "subject.subject", "Subject"."createdAt" AS "subject.createdAt", "Subject"."updatedAt" AS "subject.updatedAt", "Packet"."id" AS "packet.id", "Packet"."name" AS "packet.name", "Packet"."packet_mongo" AS "packet.packet_mongo", "Packet"."createdAt" AS "packet.createdAt", "Packet"."updatedAt" AS "packet.updatedAt", "Packet"."TournamentId" AS "packet.TournamentId", "packet.Tournament"."id" AS "packet.tournament.id", "packet.Tournament"."name" AS "packet.tournament.name", "packet.Tournament"."difficulty" AS "packet.tournament.difficulty", "packet.Tournament"."power" AS "packet.tournament.power", "packet.Tournament"."year" AS "packet.tournament.year", "packet.Tournament"."tournament_mongo" AS "packet.tournament.tournament_mongo", "packet.Tournament"."createdAt" AS "packet.tournament.createdAt", "packet.Tournament"."updatedAt" AS "packet.tournament.updatedAt" FROM "Tossups" LEFT OUTER JOIN "Subjects" AS "Subject" ON "Subject"."id" = "Tossups"."SubjectId" LEFT OUTER JOIN "Packets" AS "Packet" ON "Packet"."id" = "Tossups"."PacketId" LEFT OUTER JOIN "Tournaments" AS "packet.Tournament" ON "packet.Tournament"."id" = "Packet"."TournamentId" WHERE "' + Tossup.getSearchVector() +'" @@ plainto_tsquery(\'english\', ' + query + ') AND flagged=false LIMIT 50', null, {raw: true}); 
      }
    }
  });
};
