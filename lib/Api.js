const axios = require('axios');
const User = require('./base/User.js');
const Beatmap = require('./base/Beatmap.js');
const Score = require('./base/Score.js');
const { diffCalculate } = require('./Utils.js');

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
	 * call
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
			const response = await api.get(endpoint, { params: { b: options.b, k: options.k, u: options.u, type: options.type, m: options.m } });
			return response.data[0];
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

		if (!response)
			throw new Error(`User Not Found`);

		return new User(response);
	}

	/**
	 * Returns the Beatmap object
	 * @param {Object} options
	 * @param {String} options.b Specify a beatmapId to return metadata from
	 * @returns {Promise<Beatmap>}
	 */
	async getBeatmap(options) {
		const response = await this.callToApi('/get_beatmaps', options);

		if (!response)
			throw new Error(`Beatmap Not Found`);

		return new Beatmap(response);
	}

	/**
	 * Returns the Score object
	 * @param {Object} options
	 * @param {String} options.b Specify a beatmapId to return score information from
	 * @param {String} options.u Specify a userId or a username to return information for
	 * @param {0|1|2|3} options.m Mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania)
	 * @param {"string"|"id"} options.type Specify if u is a user_id or a username
	 * @returns {Promise<Score>}
	 */
	async getScore(options) {
		const beatmap = await this.getBeatmap({ b: options.b });

		const response = await this.callToApi('/get_scores', options);

		if (!response)
			throw new Error(`Score Not Found`);

		return new Score(response, beatmap);
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
	 * @param {Number} mods
	 */
	async diffCalculate(stats, mods) {
		if (!mods)
			throw new Error(`Mods are not specified`);

		if (typeof mods !== `object`)
			throw new Error(`Mods must be an object`);

		return diffCalculate['BeatmapStats'](stats, mods);
	}
}

module.exports = Api;