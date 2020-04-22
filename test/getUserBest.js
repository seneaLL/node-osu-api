const osu = require('../index.js');
const osuApi = new osu.Api(process.env.osuApiKey);

osuApi.getUserBest({ u: 'seneaL' }).then(scores => {
    console.log(scores);
}).catch(err => {
    console.log(err);
});
