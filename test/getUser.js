const osu = require('../index.js');
const osuApi = new osu.Api();

osuApi.apiKey = process.env.osuApiKey;

osuApi.getUser({ u: 'seneaL' }).then(user => {
    console.log(user);
}).catch(err => {
    console.log(err);
});