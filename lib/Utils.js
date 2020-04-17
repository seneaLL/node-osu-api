module.exports = {
    /**
	 * An enum of mods with their bitwise representation
	 * @readonly
	 * @enum {Number}
	 */
	Mods: {
		'': 0,
		'NF': 1,
		'EZ': 2,
		'TD': 4,
		'HD': 8,
		'HR': 16,
		'SD': 32,
		'DT': 64,
		'RX': 128,
		'HT': 256,
		'NC': 512,
		'FL': 1024,
		'AT': 2048,
		'SO': 4096,
		'AP': 8192,
		'PF': 16384,
		'4K': 32768,
		'5K': 65536,
		'6K': 131072,
		'7K': 262144,
		'8K': 524288,
		'FI': 1048576,
		'RD': 2097152,
		'LM': 4194304,
		'9K': 16777216,
		'10K': 33554432,
		'1K': 67108864,
		'3K': 134217728,
		'2K': 268435456,
		'V2': 536870912,
	},

	Beatmaps: {
		/**
		 * Approval states
		 * @readonly
		 * @enum {String}
		 */
		approved: {
			'-2': 'Graveyard',
			'-1': 'WIP',
			'0': 'Pending',
			'1': 'Ranked',
			'2': 'Approved',
			'3': 'Qualified',
			'4': 'Loved'
		},
		/**
		 * Song genres
		 * @readonly
		 * @enum {String}
		 */
		genre: {
			'0': 'Any',
			'1': 'Unspecified',
			'2': 'Video Game',
			'3': 'Anime',
			'4': 'Rock',
			'5': 'Pop',
			'6': 'Other',
			'7': 'Novelty',
			'9': 'Hip Hop',
			'10': 'Electronic'
		},
		/**
		 * Song languages
		 * @readonly
		 * @enum {String}
		 */
		language: {
			'0': 'Any',
			'1': 'Other',
			'2': 'English',
			'3': 'Japanese',
			'4': 'Chinese',
			'5': 'Instrumental',
			'6': 'Korean',
			'7': 'French',
			'8': 'German',
			'9': 'Swedish',
			'10': 'Spanish',
			'11': 'Italian'
		},
		/**
		 * Game modes
		 * @readonly
		 * @enum {String}
		 */
		mode: {
			'0': 'Standard',
			'1': 'Taiko',
			'2': 'Catch the Beat',
			'3': 'Mania'
		}
	},

	AccurqacyCalculate: {
		/**
		 * Calculate accuracy for STD
		 * @param {Object} counts Hit counts
		 */
		Standard: counts => {
			const total = counts.count50 + counts.count100 + counts.count300 + counts.countmiss;
			return ((counts.count300 * 300 + counts.count100 * 100 + counts.count50 * 50) / (total * 300)) * 100;
		},
		/**
		 * Calculate accuracy for TAIKO
		 * @param {Object} counts Hit counts
		 */
		Taiko: counts => {
			const total = counts.count100 + counts.count300 + counts.countmiss;
			return (((counts.count300 + counts.count100 * .5) * 300) / (total * 300)) * 100;
		},
		/**
		 * Calculate accuracy for CTB
		 * @param {Object} counts Hit counts
		 */
		'Catch the Beat': counts => {
			const total = counts.count50 + counts.count100 + counts.count300 + counts.countkatu + counts.countmiss;
			return ((counts.count50 + counts.count100 + counts.count300) / total) * 100;
		},
		/**
		 * Calculate accuracy for MANIA
		 * @param {Object} counts Hit counts
		 */
		Mania: counts => {
			const total = counts.count50 + counts.count100 + counts.count300 + counts.countkatu + counts.countgeki + counts.countmiss;
			return ((counts.count50 * 50 + counts.count100 * 100 + counts.countkatu * 200 + (counts.count300 + counts.countgeki) * 300) / (total * 300)) * 100;
		}
	},

	diffCalculate: {
		/**
		 * Calculate CS, AR, OD, HP, BPM, Length
		 * @param {Object} stats Beatmap stats
		 * @param {Number} mods Beatmap mods
		 */
		BeatmapStats: (stats, mods) => {

			const ar_ms_step1 = 120;
			const ar_ms_step2 = 150;

			const ar0_ms = 1800;
			const ar5_ms = 1200;
			const ar10_ms = 450;

			const od_ms_step = 6;
			const od0_ms = 79.5;
			const od10_ms = 19.5;

			var speed = 1, ar_multiplier = 1, ar, ar_ms, cs_multiplier = 1, cs, od, odms, od_multiplier = 1, hp, hp_multiplier = 1, length;

			if (mods.includes("DT"))
				speed *= 1.5;
			else if (mods.includes("HT"))
				speed *= .75;

			if (mods.includes("HR")) {
				ar_multiplier *= 1.4;
				cs_multiplier *= 1.3;
				od_multiplier *= 1.4;
				hp_multiplier *= 1.4;
			}
			else if (mods.includes("EZ")) {
				ar_multiplier *= .5;
				cs_multiplier *= .5;
				od_multiplier *= .5;
				hp_multiplier *= .5;
			}

			//AR calculate
			ar = stats.AR * ar_multiplier;
			if (ar <= 5) ar_ms = ar0_ms - ar_ms_step1 * ar;
			else ar_ms = ar5_ms - ar_ms_step2 * (ar - 5);
			if (ar_ms < ar10_ms) ar_ms = ar10_ms;
			if (ar_ms > ar0_ms) ar_ms = ar0_ms;
			ar_ms /= speed;
			if (ar <= 5) ar = (ar0_ms - ar_ms) / ar_ms_step1;
			else ar = 5 + (ar5_ms - ar_ms) / ar_ms_step2;

			//CS calculate
			cs = stats.CS * cs_multiplier;
			if (cs > 10) cs = 10;

			//OD calculate
			od = stats.OD * od_multiplier;
			odms = od0_ms - Math.ceil(od_ms_step * od);
			odms = Math.min(od0_ms, Math.max(od10_ms, odms));
			odms /= speed;
			od = (od0_ms - odms) / od_ms_step;

			//HP calculate
			hp = stats.HP * hp_multiplier;
			if (hp > 10) hp = 10;

			//BPM calculate
			bpm = stats.bpm * speed;

			//Length calculate
			total_length = stats.total_length / speed;
			drain_length = stats.drain_length / speed;

			return { CS: cs, AR: ar, OD: od, HP: hp, bpm: bpm, total_length: total_length, drain_length: drain_length }

		}
	}
};