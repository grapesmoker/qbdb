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
           .query('SELECT "Bonus".*, "Subject"."id" AS "subject.id", "Subject"."subject" AS "subject.subject", "Subject"."createdAt" AS "subject.createdAt", "Subject"."updatedAt" AS "subject.updatedAt", "Packet"."id" AS "packet.id", "Packet"."name" AS "packet.name", "Packet"."packet_mongo" AS "packet.packet_mongo", "Packet"."createdAt" AS "packet.createdAt", "Packet"."updatedAt" AS "packet.updatedAt", "Packet"."TournamentId" AS "packet.TournamentId", "packet.Tournament"."id" AS "packet.tournament.id", "packet.Tournament"."name" AS "packet.tournament.name", "packet.Tournament"."difficulty" AS "packet.tournament.difficulty", "packet.Tournament"."power" AS "packet.tournament.power", "packet.Tournament"."year" AS "packet.tournament.year", "packet.Tournament"."tournament_mongo" AS "packet.tournament.tournament_mongo", "packet.Tournament"."createdAt" AS "packet.tournament.createdAt", "packet.Tournament"."updatedAt" AS "packet.tournament.updatedAt" FROM "Bonus" LEFT OUTER JOIN "Subjects" AS "Subject" ON "Subject"."id" = "Bonus"."SubjectId" LEFT OUTER JOIN "Packets" AS "Packet" ON "Packet"."id" = "Bonus"."PacketId" LEFT OUTER JOIN "Tournaments" AS "packet.Tournament" ON "packet.Tournament"."id" = "Packet"."TournamentId" WHERE "' + Bonus.getSearchVector() +'" @@ plainto_tsquery(\'english\', ' + query + ') AND flagged=false LIMIT 50');
       }
    }
  });
}
