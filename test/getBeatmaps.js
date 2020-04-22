const osu = require('../index.js');
const osuApi = new osu.Api(process.env.osuApiKey);

osuApi.getBeatmaps({ b: '1969946' }).then(beatmaps => {
    console.log(beatmaps);
}).catch(err => {
    console.log(err);
});


