const http = require('http');

const server = http.createServer((req, res) => {

    res.write('hello, world!');
    return res.endd();
} )

server.listen(3000, () => {
    console.log('listening for request on port 3000');
})