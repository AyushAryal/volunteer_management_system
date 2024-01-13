const fs = require("fs");
const util = require("node:util");

const args = util.parseArgs({
    options: {
        input: {
            type: "string",
            short: "i",
        },
        output: {
            type:"string",
            short: "o",
        }
    }
})

if (args.values.input === undefined || args.values.output === undefined) {
    console.log("Both input (-i) and output (-o) files required");
    process.exit();
}


let geojson = JSON.parse(fs.readFileSync(args.values.input));

for (let feature of geojson["features"]) {
    feature["geometry"]["type"] = "Polygon";
    feature["geometry"]["coordinates"] = feature["geometry"]["coordinates"][0][0];
}

let output = JSON.stringify(geojson);
fs.writeFileSync(args.values.output, output);
