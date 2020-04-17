const osu = require('../index.js');
const osuApi = new osu.Api();

osuApi.apiKey = process.env.osuApiKey;

osuApi.getBeatmap({ b: '92426' }).then(beatmap => {
    console.log(beatmap);
}).catch(err => {
    console.log(err);
});