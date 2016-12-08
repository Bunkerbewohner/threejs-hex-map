module.exports = {
    entry: "./lib/src/index.js",
    output: {
        path: __dirname + "/dist/",
        filename: "threejs-hex-map.js"
    },
    externals: {
        "three": "THREE"
    }
}