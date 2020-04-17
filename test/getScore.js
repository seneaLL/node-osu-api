const osu = require('../index.js');
const osuApi = new osu.Api();

osuApi.apiKey = process.env.osuApiKey;

osuApi.getScore({ b: `728001`, u: `seneaL` }).then(score => {
    osuApi.diffCalculate(score.beatmap.difficulty, score.mods).then(recalc => {
        console.log(recalc);
    }).catch(err => {
        console.log(err);
    });
}).catch(err => {
    console.log(err);
});