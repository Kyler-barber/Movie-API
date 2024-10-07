const http = require('http');
const url = require('url');
const fs = require('fs'); // Import fs module

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const logEntry = `${new Date().toISOString()} - ${req.url}\n`;

    // Log the request to log.txt
    fs.appendFile('log.txt', logEntry, (err) => {
        if (err) {
            console.log('Error writing to log file.');
        }
    });

    if (parsedUrl.pathname === '/documentation') {
        fs.readFile('./documentation.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading file.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        fs.readFile('./index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading file.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
});

server.listen(8080, () => {
    console.log('Server running at http://127.0.0.1:8080/');
});
