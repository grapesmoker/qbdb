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
       addFullTextIndex: function() {
         if(sequelize.options.dialect !== 'postgres') {
           console.log('Not creating search index, must be using POSTGRES to do this');
           return;
         }

         var searchFields = {'A': ['leadin', 'part1', 'part2', 'part3'], 'B': ['answer1', 'answer2', 'answer3']};
         var Bonus = this;
         var searchVector = [];

         Object.keys(searchFields).forEach(function(key) {
           searchFields[key].forEach(function(e) {
             searchVector.push("setweight(to_tsvector('english', coalesce("+e+",'')), '"+key+"')");
           });
         });
         searchVector = searchVector.join(' || ');

         var vectorName = Bonus.getSearchVector();
         sequelize
           .query('ALTER TABLE "' + Bonus.tableName + '" ADD COLUMN "' + vectorName + '" TSVECTOR')
           .success(function() {
             return sequelize
             .query('UPDATE "' + Bonus.tableName + '" SET "' + vectorName + '" = '+searchVector)
             .error(console.log);
           }).success(function() {
             return sequelize
             .query('CREATE INDEX bonus_search_idx ON "' + Bonus.tableName + '" USING gin("' + vectorName + '");')
             .error(console.log);
           }).success(function() {
             return sequelize
             //TODO: clean this up
             .query('CREATE TRIGGER bonus_vector_update BEFORE INSERT OR UPDATE ON "' + Bonus.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.english\', ' + Object.keys(searchFields).map(function(key) { return searchFields[key]}).join(', ') + ')')
               .error(console.log);
               }).error(console.log);
             }
             ,
         search: function(query) {
           if(sequelize.options.dialect !== 'postgres') {
             console.log('Search is only implemented on POSTGRES database');
             return;
           }
           var Bonus = this;

           query = sequelize.getQueryInterface().escape(query);

           return sequelize
             .query('SELECT ts_rank(ARRAY[0, 0, 0.8, 0.4], "BonusText", query) AS rank, "Bonus".*, "Subject"."id" AS "subject.id", "Subject"."subject" AS "subject.subject", "Subject"."createdAt" AS "subject.createdAt", "Subject"."updatedAt" AS "subject.updatedAt", "Packet"."id" AS "packet.id", "Packet"."name" AS "packet.name", "Packet"."packet_mongo" AS "packet.packet_mongo", "Packet"."createdAt" AS "packet.createdAt", "Packet"."updatedAt" AS "packet.updatedAt", "Packet"."TournamentId" AS "packet.TournamentId", "packet.Tournament"."id" AS "packet.tournament.id", "packet.Tournament"."name" AS "packet.tournament.name", "packet.Tournament"."difficulty" AS "packet.tournament.difficulty", "packet.Tournament"."power" AS "packet.tournament.power", "packet.Tournament"."year" AS "packet.tournament.year", "packet.Tournament"."tournament_mongo" AS "packet.tournament.tournament_mongo", "packet.Tournament"."createdAt" AS "packet.tournament.createdAt", "packet.Tournament"."updatedAt" AS "packet.tournament.updatedAt" FROM plainto_tsquery(\'english\', ' + query + ') query, "Bonus" LEFT OUTER JOIN "Subjects" AS "Subject" ON "Subject"."id" = "Bonus"."SubjectId" LEFT OUTER JOIN "Packets" AS "Packet" ON "Packet"."id" = "Bonus"."PacketId" LEFT OUTER JOIN "Tournaments" AS "packet.Tournament" ON "packet.Tournament"."id" = "Packet"."TournamentId" WHERE "' + Bonus.getSearchVector() +'" @@ query AND flagged=false ORDER BY rank DESC LIMIT 50');
         }
     }
 });
}
