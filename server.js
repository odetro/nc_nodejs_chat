const http = require('http');
const fs = require('fs');
const Url = require('url-parse');

http.createServer( (request, response) => {
    if (request.url === '/favicon.ico') return;

    if (request.url === '/stylesheet.css') {
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(fs.readFileSync('stylesheet.css', { encoding: "UTF-8" }));
        return response.end();
    }

    const url = new Url(request.url, true);
    const name = url.query.name;
    const message = url.query.message;
  
    const textmessage = {
      name,
      message,
    };
  
    const historyFile = fs.readFileSync('history.json', { encoding: "UTF-8" }) || [];
    const historyData = JSON.parse(historyFile);

    historyData.push(textmessage);

    fs.writeFileSync('history.json', JSON.stringify(historyData));
  
    let file = fs.readFileSync('index.html', { encoding: "UTF-8" })
    file = file.replace("%history_chat_script%", JSON.stringify(historyData));
    file = file.replace("%name%", textmessage.name || "");
  
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(file);
    response.end();
  }).listen(8080);

console.log("Listening...");