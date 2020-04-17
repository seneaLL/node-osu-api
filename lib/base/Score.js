const { AccurqacyCalculate, Mods } = require('../Utils.js');
/**
 * A score for a beatmap
 * @prop {Number} score
 * @prop {Object} user
 * @prop {String} user.name
 * @prop {String} user.id
 * @prop {Object} counts
 * @prop {Number} counts.count300
 * @prop {Number} counts.count100
 * @prop {Number} counts.count50
 * @prop {Number} counts.countgeki
 * @prop {Number} counts.countkatu
 * @prop {Number} counts.countmiss
 * @prop {Number} maxCombo
 * @prop {Boolean} perfect
 * @prop {String} date
 * @prop {Number} rank
 * @prop {Number} pp
 * @prop {Boolean} hasReplay
 * @prop {Date} date
 * @prop {Number} enabled_mods
 * @prop {String[]} mods
 * @prop {Number} accuracy
 * @prop {Beatmap} beatmap
 */
class Score {
	constructor(data, beatmap) {

		this.score = Number(data.score);
		this.user = {
			name: data.username,
			id: data.user_id
		};
		this.counts = {
			count300: Number(data.count300),
			count100: Number(data.count100),
			count50: Number(data.count50),
			countgeki: Number(data.countgeki),
			countkatu: Number(data.countkatu),
			countmiss: Number(data.countmiss)
		};
		this.maxCombo = Number(data.maxcombo);
		this.perfect = data.perfect === '1';
		this.date = data.date;
		this.rank = Number(data.rank);
		this.pp = Number(data.pp || null);
		this.hasReplay = data.replay_available === '1';
		this.enabled_mods = Number(data.enabled_mods);

        this.beatmap = beatmap;
		this.accuracy = AccurqacyCalculate[this.beatmap.mode](this.counts);
		
	}

	get mods() {
		this._mods = [];
		for (var mod in Mods) {
			if ((Mods[mod] & this.enabled_mods) != 0)
			this._mods.push(mod);
		}

		return this._mods;
	}

}

module.exports = Score;