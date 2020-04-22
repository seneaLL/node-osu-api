# node-osu-api
#### Simplifies working with osu! api v1

# Installation

```
npm install node-osu-api
```

# Constructor

```js
const osuApi = new osu.Api(process.env.osuApiKey);
```

### getBeatmaps
```js
osuApi.getBeatmaps({ b: '1969946' }).then(beatmaps => {
    console.log(beatmaps);
});
```

### getUser
```js
osuApi.getUser({ u: 'seneaL' }).then(user => {
    console.log(user);
});
```

### getScores && Calculate stats with mods
```js
osuApi.getScores({ b: `728001`, u: `seneaL`}).then(scores => {
    osuApi.diffCalculate(scores[0].beatmap.difficulty, 72).then(recalc => {
        console.log(scores[0]);
        console.log(recalc);
    });
});
```

### getUserRecent
```js
osuApi.getUserRecent({ u: 'seneaL'}).then(scores => {
    console.log(scores);
});
```

### getUserBest
```js
osuApi.getUserBest({ u: 'seneaL' }).then(scores => {
    console.log(scores);
});
```

License
----
MIT
