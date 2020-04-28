const htmlToText = require('html-to-text');

/**
 * A timeline event for a user
 * @prop {String} text
 * @prop {String} beatmapId
 * @prop {String} beatmapSetId
 * @prop {String} date
 * @prop {Number} epicFactor
 */
class Event {
	constructor(data) {
		this.text = htmlToText.fromString(data.display_html);
		this.beatmapId = data.beatmap_id;
		this.beatmapsetId = data.beatmapset_id;
		this.date = data.date;
		this.epicFactor = Number(data.epicfactor);
	}

}

module.exports = Event;