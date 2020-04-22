const axios = require('axios');
const User = require('./base/User.js');
const Beatmap = require('./base/Beatmaps.js');
const Score = require('./base/Scores.js');
const { diffCalculate, Mods } = require('./Utils.js');

var api;

class Api {
    /**
	 * Creates a new node-osu-api
	 * @param {String} apiKey your osu api key
	 */
	constructor(apiKey) {
		api = axios.create({
			baseURL: `https://osu.ppy.sh/api`
		});
		this.apiKey = apiKey;
	}

    /**
	 * Call to api
	 * @param {String} endpoint
	 * @param {Object} options
	 * @returns {Promise<Object>} The response body
	 */
	async callToApi(endpoint, options) {
		if (!this.apiKey)
			throw new Error('apiKey not set');
		options.k = this.apiKey;

		try {
			const response = await api.get(endpoint, { params: options });
			return response.data;
		} catch (error) {
			throw new Error(error.response || error);
		}
	}

	/**
	 * 
	 * @param {Number|Object} mods 
	 * @returns {Object}
	 */
	enabledMods(mods) {
		if (typeof mods !== `number` && typeof mods !== `object`)
			throw new Error(`The mods variable must be an object or a numeric value`);

		if (typeof mods === `number`) {
			var _mods = [];
			for (var mod in Mods) {
				if ((Mods[mod] & mods) != 0)
					_mods.push(mod);
			}

			mods = _mods;
		}
		return mods;
	}

	/**
	 * 
	 * @param {Object} mods 
	 * @returns {Number}
	 */
	getModsEnum(mods) {
		if (typeof mods !== `object`)
			throw new Error(`The mods variable must be an object value`);

		let return_value = 0;
		mods.forEach(mod => {
			return_value |= Mods[mod.toUpperCase()];
		});
		return return_value;
	};

    /**
	 * Returns the User object
	 * @param {Object} options
	 * @param {String} options.u Specify a userId or a username to return metadata from
	 * @param {0|1|2|3} options.m Game Mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania)
	 * @param {"string"|"id"} options.type Specify if u is a user_id or a username
	 * @returns {Promise<User>}
	 */
	async getUser(options) {
		const response = await this.callToApi('/get_user', options);

		if (!response[0])
			throw new Error(`User are not found`);

		return new User(response[0]);
	}

	/**
	 * Returns an array of Beatmap object
	 * @param {Object} options
	 * @param {String} options.b Specify a beatmapId to return metadata from
	 * @param {String} options.u Specify a user_id or a username to return metadata from
	 * @param {"string"|"id"} options.type Specify if u is a user_id or a username
	 * @param {0|1|2|3} options.m Game Mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania)
	 * @param {String} options.a Specify whether converted beatmaps are included (0 = not included, 1 = included). Only has an effect if m is chosen and not 0. Converted maps show their converted difficulty rating. Optional, default is 0
	 * @param {String} options.limit Amount of results. Optional, default and maximum are 500
	 * @param {Object || Number} options.mods Mods that applies to the beatmap requested. Optional, default is 0. (requesting multiple mods is supported, but it should not contain any non-difficulty-increasing mods or the return value will be invalid.)
	 * @returns {Promise<Beatmap[]>}
	 */
	async getBeatmaps(options) {
		const DIFF_MODS = ["HR", "EZ", "DT", "HT"];

		if (options.mods) {
			if (typeof options.mods !== `number` && typeof options.mods !== `object`)
				throw new Error(`The mods variable must be an object or a numeric value`);

			if (typeof options.mods === `object`)
				options.mods = this.getModsEnum(options.mods.filter(mod => DIFF_MODS.includes(mod)));

			if (typeof options.mods === `number`)
				options.mods = this.getModsEnum(this.enabledMods(options.mods).filter(mod => DIFF_MODS.includes(mod)));
		}

		const response = await this.callToApi('/get_beatmaps', options);

		if (!response)
			throw new Error(`Beatmap are not found`);

		var returnBeatmaps = [];

		for (var beatmap in response) {
			returnBeatmaps.push(new Beatmap(response[beatmap]));
		}
		return returnBeatmaps;
	}

	/**
	 * Returns an array of Score object
	 * @param {Object} options
	 * @param {String} options.b Specify a beatmap_id to return score information from (required)
	 * @param {String} options.u Specify a user_id or a username to return score information for
	 * @param {0|1|2|3} options.m Mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, default value is 0
	 * @param {Number} options.mods Specify a mod
	 * @param {"string"|"id"} options.type Specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behaviour is automatic recognition (may be problematic for usernames made up of digits only)
	 * @returns {Promise<Score[]>}
	 */
	async getScores(options) {
		const beatmap = await this.getBeatmaps({ b: options.b });

		if (typeof options.mods === `object`) {
			let _mods = 0;
			options.mods.forEach(mod => {
				_mods |= Mods[mod.toUpperCase()];
			});
			options.mods = _mods;
		}

		const response = await this.callToApi('/get_scores', options);

		if (response.length < 1)
			throw new Error(`Scores are not found`);

		var returnScores = [];

		for (var score in response) {
			const user = await this.getUser({ u: response[score].user_id, m: options.m });
			returnScores.push(new Score(response[score], beatmap[0], user));
		}

		return returnScores
	}

	/**
	 * Returns an array of Score object
	 * @param {Object} options
	 * @param {String} options.u Specify a user_id or a username to return recent plays from (required)
	 * @param {0|1|2|3} options.m Mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, default value is 0
	 * @param {String} options.limit Amount of results (range between 1 and 50 - defaults to 10)
	 * @param {"string"|"id"} options.type Specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behavior is automatic recognition (may be problematic for usernames made up of digits only)
	 * @returns {Promise<Score[]>}
	*/
	async getUserRecent(options) {
		const recentScores = await (this.callToApi('/get_user_recent', options));
		const user = await this.getUser({ u: options.u, m: options.m });

		if (recentScores.length < 1)
			throw new Error(`Recent scores are not found`);

		var returnScores = [];

		for (var score in recentScores) {
			const beatmap = await this.getBeatmaps({ b: recentScores[score].beatmap_id });
			returnScores.push(new Score(recentScores[score], beatmap[0], user));
		}

		return returnScores;
	}

	/**
	 * Returns an array of Score objects
	 * @param {Object} options
	 * @param {String} options.u Specify a user_id or a username to return best scores from (required)
	 * @param {0|1|2|3} [options.m] Mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, default value is 0
	 * @param {"string"|"id"} [options.type] Specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behavior is automatic recognition (may be problematic for usernames made up of digits only)
	 * @param {Number} [options.limit] Amount of results (range between 1 and 100 - defaults to 10)
	 * @returns {Promise<Score[]>}
	 */
	async getUserBest(options) {
		const user = await this.getUser({ u: options.u, m: options.m });
		const response = await this.callToApi('/get_user_best', options);

		if (response.length < 1)
			throw new Error(`Scores are not found`);

		var returnScores = [];

		for (var score in response) {
			const beatmap = await this.getBeatmaps({ b: response[score].beatmap_id });
			returnScores.push(new Score(response[score], beatmap[0], user));
		}

		return returnScores
	}

	/**
	 * Returns the recalculated beatmap stats
	 * @param {Object} stats
	 * @param {Number} stats.CS
	 * @param {Number} stats.AR
	 * @param {Number} stats.OD
	 * @param {Number} stats.HP
	 * @param {Number} stats.bpm
	 * @param {Number} stats.total_length
	 * @param {Number} stats.drain_length
	 * @param {Object | Number} mods	
	 */
	async diffCalculate(stats, mods) {
		return diffCalculate['BeatmapStats'](stats, this.enabledMods(mods));
	}
}

module.exports = Api;