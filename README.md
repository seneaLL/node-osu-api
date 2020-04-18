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

### getBeatmap
```js
osuApi.getBeatmap({ b: 728001 }).then(beatmap => {
    console.log(beatmap);
})
```

### getUser
```js
osuApi.getUser({ u: `seneaL` }).then(user => {
    console.log(user);
})
```

### getScore && Calculate stats with mods
```js
osuApi.getScore({ b: 728001, u: `seneaL` }).then(score => {
    osuApi.diffCalculate(score.beatmap.difficulty, score.mods).then(recalc => {
        console.log(recalc);
    })
})
```

### getUserRecent
```js
osuApi.getUserRecent({ u: 'seneaL'}).then(score => {
    console.log(score);
});
```

### getUserBest
```js
osuApi.getUserBest({ u: 'seneaL' }).then(score => {
    console.log(score);
})
```

License
----
MIT
