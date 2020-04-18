const osu = require('../index.js');
const osuApi = new osu.Api();

osuApi.apiKey = process.env.osuApiKey;

osuApi.getUserRecent({ u: 'seneaL'}).then(score => {
    console.log(score);
}).catch(err => {
    console.log(err);
});
