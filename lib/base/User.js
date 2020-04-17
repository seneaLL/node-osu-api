/**
 @prop {String} id
 @prop {String} username
 @prop {String} country
 @prop {Object} stats
 @prop {Number} stats.playcount
 @prop {Number} stats.accuracy
 @prop {String} stats.accuracyFormated
 @prop {Number} stats.secondsPlayed
 @prop {Date} stats.join
 @prop {Number} stats.level
 @prop {Object} pp
 @prop {Number} pp.raw
 @prop {Number} pp.worldRank
 @prop {Number} pp.countryRank
 @prop {Object} scores
 @prop {Number} scores.total
 @prop {Number} scores.ranked
 @prop {Object} hits
 @prop {Number} hits.total
 @prop {Number} hits.count300
 @prop {Number} hits.count100
 @prop {Number} hits.count50
 @prop {Object} ranks
 @prop {Number} ranks.SSH
 @prop {Number} ranks.SS
 @prop {Number} ranks.SH
 @prop {Number} ranks.S
 @prop {Number} ranks.A
**/

class User {
    constructor(data) {
        this.id = data.user_id;
        this.username = data.username;
        this.country = data.country;
        this.stats = {
            playcount: Number(data.playcount),
            accuracy: Number(data.accuracy),
            accuracyFormated: `${Number(data.accuracy).toFixed(2)}%`,
            secondsPlayed: Number(data.total_seconds_played),
            join: data.join_date,
            level: Number(data.level)
        };
        this.pp = {
            raw: Number(data.pp_raw),
            worldRank: Number(data.pp_rank),
            countryRank: Number(data.pp_country_rank)
        };
        this.scores = {
            total: Number(data.total_score),
            ranked: Number(data.ranked_score)
        };
        this.hits = {
            total: Number(data.count300) + Number(data.count100) + Number(data.count50),
            count300: Number(data.count300),
            count100: Number(data.count100),
            count50: Number(data.count50)
        };
        this.ranks = {
            SSH: Number(data.count_rank_ssh),
            SS: Number(data.count_rank_ss),
            SH: Number(data.count_rank_sh),
            A: Number(data.count_rank_a)
        };
    }
}

module.exports = User;