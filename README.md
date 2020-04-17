# node-osu-api
#### Simplifies working with osu! api v1

# Installation

```
npm install node-osu-api
```

# Constructor

```
const osuApi = new osu.Api(process.env.osuApiKey);
```

### getBeatmap
```
osuApi.getBeatmap({ b: 728001 }).then(beatmap => {
    console.log(beatmap);
})
```

### getUser
```
osuApi.getUser({ u: `seneaL` }).then(user => {
    console.log(user);
})
```

### getScore && Calculate stats with mods
```
osuApi.getScore({ b: 728001, u: `seneaL` }).then(score => {
    osuApi.diffCalculate(score.beatmap.difficulty, score.mods).then(recalc => {
        console.log(recalc);
    })
})
```

License
----
MIT
