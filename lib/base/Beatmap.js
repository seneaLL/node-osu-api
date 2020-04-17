const { Beatmaps } = require('../Utils.js');

/**
 * A beatmap
 * @prop {String} id
 * @prop {String} beatmapSetId
 * @prop {String} hash
 * @prop {String} title
 * @prop {String} creator
 * @prop {String} version
 * @prop {String} source
 * @prop {String} artist
 * @prop {String} genre
 * @prop {String} language
 * @prop {Number} rating
 * @prop {Number} bpm
 * @prop {String} mode
 * @prop {String[]} tags
 * @prop {String} approvalStatus
 * @prop {String} raw_submitDate
 * @prop {String} raw_approvedDate
 * @prop {String} raw_lastUpdate
 * @prop {Number} maxCombo
 * @prop {Object} objects
 * @prop {Number} objects.notes
 * @prop {Number} objects.slider
 * @prop {Number} objects.spinner
 * @prop {Object} difficulty
 * @prop {Number} difficulty.stars
 * @prop {Number} difficulty.aim_stars
 * @prop {Number} difficulty.speed_stars
 * @prop {Number} difficulty.total_length
 * @prop {Number} difficulty.drain_length
 * @prop {Number} difficulty.bpm
 * @prop {Number} difficulty.CS
 * @prop {Number} difficulty.OD
 * @prop {Number} difficulty.AR
 * @prop {Number} difficulty.HP
 * @prop {Object} stats
 * @prop {Number} stats.favorites
 * @prop {Number} stats.favourites
 * @prop {Number} stats.plays
 * @prop {Number} stats.passes
 * @prop {Object} submit
 * @prop {Date} submit.submitDate
 * @prop {Date} submit.approvedDate
 * @prop {Date} submit.lastUpdate
 */

class Beatmap {
    constructor(data) {
        this.id = data.beatmap_id;
        this.beatmapSetId = data.beatmapset_id;
        this.hash = data.file_md5;
        this.title = data.title;
        this.creator = data.creator;
        this.version = data.version;
        this.source = data.source;
        this.artist = data.artist;
        this.genre = Beatmaps.genre[data.genre_id];
        this.language = Beatmaps.language[data.language_id];
        this.rating = Number(data.rating);
        this.mode = Beatmaps.mode[data.mode];
        this.tags = data.tags.split(' ');
        this.approvalStatus = Beatmaps.approved[data.approved];
        this.submit = {
            submitDate: data.submit_date,
            approvedDate: data.approved_date,
            lastUpdate: data.last_update
        }
        this.maxCombo = Number(data.max_combo);
        this.objects = {
            normal: Number(data.count_normal),
            slider: Number(data.count_slider),
            spinner: Number(data.count_spinner)
        };
        this.difficulty = {
            stars: Number(data.difficultyrating),
            aim_stars: Number(data.diff_aim),
            speed_star: Number(data.diff_speed),
            total_length: Number(data.total_length),
            drain_length: Number(data.hit_length),
            bpm: Number(data.bpm),
            CS: Number(data.diff_size),
            OD: Number(data.diff_overall),
            AR: Number(data.diff_approach),
            HP: Number(data.diff_drain)
        };
        this.counts = {
            favourites: Number(data.favourite_count),
            plays: Number(data.playcount),
            passes: Number(data.passcount)
        };
    }

}

module.exports = Beatmap;
