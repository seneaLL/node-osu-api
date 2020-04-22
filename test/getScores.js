const osu = require('../index.js');
const osuApi = new osu.Api(process.env.osuApiKey);

osuApi.getScores({ b: `728001`, u: `seneaL`}).then(scores => {
    osuApi.diffCalculate(scores[0].beatmap.difficulty, 72).then(recalc => {
        console.log(scores[0]);
        console.log(recalc);
    }).catch(err => {
        console.log(err);
    });
}).catch(err => {
    console.log(err);
});