const osu = require('../index.js');
const osuApi = new osu.Api();

osuApi.apiKey = process.env.osuApiKey;

osuApi.getUserBest({ u: 'seneaL' }).then(score => {
    console.log(score);
}).catch(err => {
    console.log(err);
});
