const axios = require('axios');
const User = require('./base/User.js');
const Beatmap = require('./base/Beatmap.js');
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
	 * @param {String} [options.s] Specify a beatmapSetId to return metadata from
	 * @param {String} [options.b] Specify a beatmapId to return metadata from
	 * @param {String} [options.u] Specify a userId or a username to return metadata from
	 * @param {"string"|"id"} [options.type] Specify if `u` is a userId or a username
	 * @param {0|1|2|3} [options.m] Game mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania)
	 * @param {Number} [options.limit] Amount of results. Default and maximum are 500
	 * @param {Number} [options.mods] Mods that apply to the beatmap requested. Default is 0
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
	 * Returns the Beatmap object
	 * @param {Object} options
	 * @param {String} options.b Specify a beatmapId to return metadata from
	 * @returns {Promise<Beatmap>}
	 */
	async getBeatmap(options) {
		const response = await this.callToApi('/get_beatmaps', options);

		if (!response[0])
			throw new Error(`Beatmap are not found`);

		return new Beatmap(response[0]);
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
		const beatmap = await this.getBeatmap({ b: options.b });

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
			const user = await this.getUser({u: response[score].user_id, m: options.m});
			returnScores.push(new Score(response[score], beatmap, user));
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
		const user = await this.getUser({u: options.u, m: options.m});

		if (recentScores.length < 1)
			throw new Error(`Recent scores are not found`);

		var returnScores = [];

		for (var score in recentScores) {
			const beatmap = await this.getBeatmap({ b: recentScores[score].beatmap_id });
			returnScores.push(new Score(recentScores[score], beatmap, user));
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
		const user = await this.getUser({u: options.u, m: options.m});
		const response = await this.callToApi('/get_user_best', options);

		if (response.length < 1)
			throw new Error(`Scores are not found`);

		var returnScores = [];

		for (var score in response) {
			const beatmap = await this.getBeatmap({b: response[score].beatmap_id});
			returnScores.push(new Score(response[score], beatmap, user));
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
		if (!mods)
			throw new Error(`Mods are not specified`);

		if (typeof mods === `number`) {
			var _mods = [];
			for (var mod in Mods) {
				if ((Mods[mod] & mods) != 0)
					_mods.push(mod);
			}

			mods = _mods;
		}

		return diffCalculate['BeatmapStats'](stats, mods);
	}
}

module.exports = Api;