const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceval = (tempval, origval) => {
    let temperature = tempval.replace("{%tempval%}", Math.floor(origval.main.temp / 10));
    temperature = temperature.replace("{%tempmin%}", Math.floor(origval.main.temp_min / 10));
    temperature = temperature.replace("{%tempmax%}", Math.floor(origval.main.temp_max / 10));
    temperature = temperature.replace("{%location%}", origval.name);
    temperature = temperature.replace("{%country%}", origval.sys.country);
    temperature = temperature.replace("{%tempstatus%}", origval.weather[0].main);

    return temperature;
}
const server = http.createServer((req, res) => {

    if (req.url == "/") {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Haldwani&appid=f35001ee80a5fbb3ade6310931770aeb')
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk)
                const arrdata = [objdata]
                const realtime = arrdata.map((val) => replaceval(homeFile, val)).join("");
                res.write(realtime)

            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end();

            });

    }
    else {
        res.end("not found")
    }
});



server.listen(8000, "127.0.0.1");